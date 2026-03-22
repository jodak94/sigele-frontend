import { useEffect, useState } from 'react';
import { X } from '@phosphor-icons/react';
import { getCaptaciones } from '../../api/captacionApi';
import { ElectorTable } from '../OperatorDashboard/ElectorTable';
import type { CaptacionRecord } from '../../types/captacion';

interface OperatorElectoresModalProps {
    operatorId: number;
    operatorName: string;
    onClose: () => void;
}

export function OperatorElectoresModal({ operatorId, operatorName, onClose }: OperatorElectoresModalProps) {
    const [records, setRecords] = useState<CaptacionRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCaptaciones(operatorId)
            .then(setRecords)
            .catch(() => setRecords([]))
            .finally(() => setIsLoading(false));
    }, [operatorId]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                    <h3 className="font-extrabold text-lg text-black">
                        Electores de: <span className="text-red-600">{operatorName}</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-black">
                        <X size={22} weight="bold" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1">
                    <ElectorTable
                        records={records}
                        isLoading={isLoading}
                        readOnly
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onRestore={() => {}}
                    />
                </div>
            </div>
        </div>
    );
}
