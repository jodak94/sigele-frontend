export function UnderConstructionPage() {
    const tiles = Array.from({ length: 30 });

    return (
        <>
            <style>{`
                @keyframes titlePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.015); }
                }
                @keyframes wrenchSpin {
                    0%   { transform: rotate(0deg); }
                    20%  { transform: rotate(20deg); }
                    40%  { transform: rotate(-20deg); }
                    60%  { transform: rotate(20deg); }
                    80%  { transform: rotate(-10deg); }
                    100% { transform: rotate(0deg); }
                }
                @keyframes cornerPulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50%      { opacity: 0.75; transform: scale(1.1); }
                }
                @keyframes dotBlink {
                    0%, 100% { opacity: 0.3; }
                    50%      { opacity: 1; }
                }
                @keyframes mui-bar1 {
                    0%   { left: -35%;  right: 100%; }
                    60%  { left: 100%;  right: -90%; }
                    100% { left: 100%;  right: -90%; }
                }
                @keyframes mui-bar2 {
                    0%   { left: -200%; right: 100%; }
                    60%  { left: 107%;  right: -8%;  }
                    100% { left: 107%;  right: -8%;  }
                }
                .uc-title {
                    font-family: 'Arial Black', 'Arial Bold', Arial, sans-serif;
                    font-size: clamp(3rem, 10vw, 8rem);
                    font-weight: 900;
                    color: #fff;
                    text-transform: uppercase;
                    line-height: 0.92;
                    letter-spacing: -2px;
                    text-shadow: 4px 4px 0 rgba(0,0,0,0.35), 0 8px 32px rgba(0,0,0,0.5);
                    animation: titlePulse 3s ease-in-out infinite;
                }
                .uc-wrench {
                    font-size: 2rem;
                    opacity: 0.75;
                    animation: wrenchSpin 4s linear infinite;
                    display: inline-block;
                    margin-top: 18px;
                }
                .uc-corner {
                    position: fixed;
                    font-size: 1.6rem;
                    opacity: 0.6;
                    z-index: 20;
                    animation: cornerPulse 2s ease-in-out infinite;
                }
                .uc-dot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.6);
                    animation: dotBlink 1.5s ease-in-out infinite;
                }
                .uc-dot:nth-child(2) { animation-delay: 0.3s; }
                .uc-dot:nth-child(3) { animation-delay: 0.6s; }
                .uc-linear-indeterminate {
                    position: relative;
                    width: clamp(180px, 40vw, 360px);
                    height: 10px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 999px;
                    overflow: hidden;
                }
                .uc-linear-indeterminate::before,
                .uc-linear-indeterminate::after {
                    content: '';
                    position: absolute;
                    top: 0; bottom: 0;
                    background: rgba(255,255,255,0.85);
                    border-radius: 999px;
                }
                .uc-linear-indeterminate::before {
                    animation: mui-bar1 2.1s cubic-bezier(0.65,0.815,0.735,0.395) infinite;
                }
                .uc-linear-indeterminate::after {
                    animation: mui-bar2 2.1s cubic-bezier(0.165,0.84,0.44,1) infinite;
                    animation-delay: 1.15s;
                }
                .uc-mosaic {
                    position: fixed;
                    inset: 0;
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    grid-template-rows: repeat(4, 1fr);
                    transform: rotate(-15deg) scale(1.6);
                    opacity: 0.45;
                }
                .uc-sticker {
                    background: #c62828;
                    border: 3px solid rgba(255,255,255,0.15);
                    border-radius: 16px;
                    padding: 10px 14px;
                    text-align: left;
                    position: relative;
                    width: 90%;
                    box-shadow: inset 0 2px 6px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.4);
                    font-family: 'Arial Black', 'Arial Bold', Arial, sans-serif;
                }
                .uc-sticker::after {
                    content: '';
                    position: absolute;
                    bottom: -10px; left: 18px;
                    width: 0; height: 0;
                    border-left: 10px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 10px solid #c62828;
                }
                .uc-sticker .name {
                    font-size: clamp(1.4rem, 3vw, 2.2rem);
                    font-weight: 900;
                    color: rgba(255,255,255,0.55);
                    letter-spacing: -1px;
                    line-height: 1;
                    text-transform: uppercase;
                }
                .uc-sticker .sub {
                    font-size: clamp(0.45rem, 1vw, 0.7rem);
                    font-weight: 700;
                    color: rgba(255,255,255,0.45);
                    text-transform: uppercase;
                    line-height: 1.2;
                    margin-top: 2px;
                    letter-spacing: 0.5px;
                }
            `}</style>

            {/* Corner icons */}
            <div className="uc-corner" style={{ top: 18, left: 18 }}>⛑️</div>
            <div className="uc-corner" style={{ bottom: 18, left: 18 }}>⛑️</div>

            {/* Top-right: 3 dots */}
            <div style={{ position: 'fixed', top: 18, right: 18, zIndex: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="uc-dot" />
                <div className="uc-dot" />
                <div className="uc-dot" />
            </div>

            {/* Mosaic background */}
            <div className="uc-mosaic">
                {tiles.map((_, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                        <div className="uc-sticker">
                            <div className="name">NAOMY</div>
                            <div className="sub">LISTA 2A OPCIÓN 10<br />MI CONCEJAL!</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Center content — absolutely centered so it's independent of fragment siblings */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 5%' }}>
                <div className="uc-title">
                    SITIO EN<br />CONSTRUCCIÓN
                </div>
                <div style={{ marginTop: 24, fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 400, color: 'rgba(255,255,255,0.9)', letterSpacing: 1, fontFamily: 'Arial, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                    Estamos trabajando para usted
                </div>
                <div className="uc-wrench">🔧</div>
                <div style={{ marginTop: 28 }}>
                    <div className="uc-linear-indeterminate" />
                </div>
            </div>
        </>
    );
}
