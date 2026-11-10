import { useEffect, useRef, type PointerEvent } from 'react';
import { useReducedMotion } from 'motion/react';
import './CampaignPopup.css';

type Campaign = 'lego' | 'festival';
const asset = (name: string) => `/campaign-popups/${name}`;
const products = {
  lego: [
    ['can1', 'lata-fresh.png', 'Lata LEGO Fresh Up vintage'],
    ['can2', 'lata-original.png', 'Lata LEGO 7UP original'],
    ['can4', 'lata-pixel.png', 'Lata LEGO con logotipo pixelado'],
    ['can5', 'lata-rainbow.png', 'Lata LEGO con arcoíris'],
    ['can3', 'lata-fido.png', 'Lata LEGO con Fido Dido'],
  ],
  festival: [
    ['shirt1', 'remera-sparkling.png', 'Remera Sparkling Club'],
    ['shirt2', 'remera-retro.png', 'Remera Six Pack Retro'],
    ['shirt3', 'remera-cherry.png', 'Remera Cherry Pop'],
  ],
};

// Visible alpha bounds within each original PNG. Normalize layout, never alter the artwork.
const canFrames: Record<string, { width: number; height: number; bounds: [number, number, number, number] }> = {
  can1: { width: 494, height: 1085, bounds: [48, 115, 455, 993] },
  can2: { width: 536, height: 1088, bounds: [48, 80, 472, 958] },
  can3: { width: 482, height: 967, bounds: [21, 24, 448, 902] },
  can4: { width: 480, height: 1210, bounds: [37, 79, 441, 958] },
  can5: { width: 586, height: 1092, bounds: [127, 144, 529, 1023] },
};

export function CampaignPopup({ campaign }: { campaign: Campaign }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reducedMotion = useReducedMotion();
  const isLego = campaign === 'lego';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    document.documentElement.classList.add('campaign-popup-open');
    dialog.querySelector<HTMLButtonElement>('.campaign-close')?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.documentElement.classList.remove('campaign-popup-open');
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const close = () => dialogRef.current?.close();
  const moveProducts = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', String(((event.clientX - bounds.left) / bounds.width - .5) * 2));
    event.currentTarget.style.setProperty('--my', String(((event.clientY - bounds.top) / bounds.height - .5) * 2));
  };
  const resetProducts = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--mx', '0');
    event.currentTarget.style.setProperty('--my', '0');
  };
  const moveButton = (event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * .06}px,${(event.clientY - bounds.top - bounds.height / 2) * .09}px)`;
  };
  const resetButton = (event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event.currentTarget.style.transform = '';
  };
  const viewCollection = () => {
    close();
    document.getElementById('capsula-merch-showcase')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <dialog
      ref={dialogRef}
      className="campaign-dialog"
      aria-labelledby={`campaign-${campaign}-title`}
      aria-describedby={`campaign-${campaign}-description`}
      onClose={() => document.documentElement.classList.remove('campaign-popup-open')}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
      }}
    >
      <section className={`campaign-popup campaign-${campaign}`} onPointerMove={moveProducts} onPointerLeave={resetProducts}>
        <button type="button" className="campaign-close" aria-label="Cerrar anuncio" onClick={close}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m3 3 14 14M17 3 3 17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </button>
        {isLego && <div className="campaign-ribbon" aria-label="Edición limitada"><div className="campaign-ribbon-track" aria-hidden="true">{[0, 1].map(index => <span key={index}>{'EDICIÓN LIMITADA · '.repeat(6)}</span>)}</div></div>}
        <div className="campaign-content">
          <div className="campaign-art" aria-label={isLego ? 'Latas vintage de la colección' : 'Prendas de la colección cápsula'}>
            {products[campaign].map(([position, image, description]) => {
              if (!isLego) return <img key={image} className={`campaign-product campaign-${position}`} src={asset(image)} alt={description} draggable={false} />;
              const { width, height, bounds: [left, top, right, bottom] } = canFrames[position];
              const visibleWidth = right - left;
              const visibleHeight = bottom - top;
              return (
                <span key={image} className={`campaign-product campaign-can-frame campaign-${position}`} style={{ aspectRatio: `${visibleWidth} / ${visibleHeight}` }}>
                  <img src={asset(image)} alt={description} draggable={false} style={{
                    width: `${width / visibleWidth * 100}%`,
                    height: `${height / visibleHeight * 100}%`,
                    left: `${-left / visibleWidth * 100}%`,
                    top: `${-top / visibleHeight * 100}%`,
                  }} />
                </span>
              );
            })}
          </div>
          <div className="campaign-copy">
            <div className="campaign-brands">
              <img className="campaign-up-logo campaign-brand-hover" src={asset('uptoseven.svg')} alt="UPTOseven" />
              <span className="campaign-cross" aria-hidden="true">×</span>
              <img className={`${isLego ? 'campaign-partner-lego' : 'campaign-partner-festival'} campaign-brand-hover`} src={asset(isLego ? 'lego.svg' : 'festival-bandera.svg')} alt={isLego ? 'LEGO' : 'Festival Bandera'} />
            </div>
            <h2 id={`campaign-${campaign}-title`}>{isLego ? <>¡Destapá la nostalgia<br />pieza por pieza!</> : <>Tu estilo te lleva al<br />Festival Bandera</>}</h2>
            <p id={`campaign-${campaign}-description`}>{isLego ? <>Descubrí la nueva colección 7UP × LEGO®.<br />Conseguí tu Mystery Box de edición limitada y armá las 6 latas vintage más icónicas de nuestra historia.</> : 'Llevate prendas de la nueva cápsula 7UP, juntá los stickers exclusivos con tu compra y completá el álbum para ganar tu entrada.'}</p>
            {!isLego && <p className="campaign-extra">¡Coleccioná los stickers y ganá tu pase al festival!</p>}
            {isLego ? (
              <a className="campaign-cta" href="https://www.lego.com/es-ar" target="_blank" rel="noopener noreferrer" onClick={close} onPointerMove={moveButton} onPointerLeave={resetButton} aria-label="¡Quiero la mía! Abrir LEGO en una pestaña nueva">¡QUIERO LA MÍA!<span className="campaign-arrow" aria-hidden="true">↗</span></a>
            ) : (
              <button type="button" className="campaign-cta" onClick={viewCollection} onPointerMove={moveButton} onPointerLeave={resetButton}>VER CÁPSULA<span className="campaign-arrow" aria-hidden="true">↗</span></button>
            )}
          </div>
        </div>
        {isLego && <img className="campaign-lemons" src={asset('limones.png')} alt="" draggable={false} />}
      </section>
    </dialog>
  );
}
