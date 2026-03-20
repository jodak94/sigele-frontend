import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { createCaptacion } from '../../api/captacionApi';
import type { CaptacionRecord } from '../../types/captacion';
import axios from 'axios';

interface CaptureFormProps {
    onSuccess: (record: CaptacionRecord) => void;
}

interface Message {
    type: 'success' | 'error';
    text: string;
}

export function CaptureForm({ onSuccess }: CaptureFormProps) {
    const [cedula, setCedula] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccionRecogida, setDireccionRecogida] = useState('');
    const [disponibleMiembroMesa, setDisponibleMiembroMesa] = useState(false);
    const [requiereTransporte, setRequiereTransporte] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => setMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [message]);

    const resetForm = () => {
        setCedula('');
        setTelefono('');
        setDireccionRecogida('');
        setDisponibleMiembroMesa(false);
        setRequiereTransporte(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await createCaptacion({
                cedula,
                telefono,
                direccionRecogida: direccionRecogida || undefined,
                disponibleMiembroMesa,
                requiereTransporte,
            });
            onSuccess(result);
            resetForm();
            setMessage({ type: 'success', text: 'Elector guardado.' });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                const owner = err.response.data?.operadorNombre;
                setMessage({ type: 'error', text: `Registrado por: ${owner ?? 'otro operador'}.` });
            } else if (axios.isAxiosError(err) && err.response?.status === 404) {
                setMessage({ type: 'error', text: 'Cédula no está en el padrón.' });
            } else {
                setMessage({ type: 'error', text: 'Error al registrar. Intente de nuevo.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
                <h2 className="text-lg font-extrabold text-black mb-5 flex items-center">
                    <UserPlus size={22} weight="bold" className="text-red-600 mr-2" />
                    Cargar Elector
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">
                            Cédula de Identidad
                        </label>
                        <input
                            type="text"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            required
                            placeholder="Ej: 1234567"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 outline-none font-bold"
                        />
                    </div>

                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Opciones Logísticas
                        </p>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={disponibleMiembroMesa}
                                onChange={(e) => setDisponibleMiembroMesa(e.target.checked)}
                                className="w-5 h-5 border-2 rounded text-black focus:ring-black"
                            />
                            <span className="ml-3 text-sm text-gray-800 font-bold">
                                Disponible Miembro de Mesa
                            </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={requiereTransporte}
                                onChange={(e) => setRequiereTransporte(e.target.checked)}
                                className="w-5 h-5 border-2 rounded text-red-800 focus:ring-red-800"
                            />
                            <span className="ml-3 text-sm text-gray-800 font-bold">
                                Requiere transporte Día D
                            </span>
                        </label>
                    </div>

                    <div className="pt-3 border-t border-gray-200 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Teléfono de Contacto <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                required
                                placeholder="Ej: 0981 123 456"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none font-bold text-sm focus:ring-2 focus:ring-red-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Dirección de Recogida (Opcional)
                            </label>
                            <input
                                type="text"
                                value={direccionRecogida}
                                onChange={(e) => setDireccionRecogida(e.target.value)}
                                placeholder="Si es distinta a padrón..."
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none font-bold text-sm focus:ring-2 focus:ring-red-600"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Registrando...' : 'Registrar Captación'}
                    </button>
                </form>

                <div
                    className={`mt-4 p-4 rounded-xl text-sm font-bold flex items-start transition-all ${
                        message
                            ? message.type === 'success'
                                ? 'bg-gray-900 text-white'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            : 'hidden'
                    }`}
                >
                    {message?.type === 'success' ? (
                        <CheckCircle size={20} weight="fill" className="text-red-500 mr-2 shrink-0 mt-0.5" />
                    ) : (
                        <WarningCircle size={20} weight="fill" className="text-red-600 mr-2 shrink-0 mt-0.5" />
                    )}
                    {message?.text}
                </div>
            </div>
        </div>
    );
}
