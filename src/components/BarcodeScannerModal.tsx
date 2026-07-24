import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { lookupProductByBarcode, ProductLookupResult, MOCK_BARCODE_DATABASE } from '../services/barcodeService';
import { X, QrCode, Sparkles, CheckCircle2, AlertCircle, Search, Keyboard } from 'lucide-react';

interface BarcodeScannerModalProps {
  onClose: () => void;
  onProductDetected: (product: ProductLookupResult) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  onClose,
  onProductDetected
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isSearchingRef = useRef(false);

  useEffect(() => {
    isSearchingRef.current = isSearching;
  }, [isSearching]);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader-container");
    scannerRef.current = html5QrCode;
    let isMounted = true;

    const startCamera = async () => {
      try {
        // Small delay to prevent issues with React StrictMode rapid double-mounts
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!isMounted) return;

        // Pre-emptively request camera permission via browser getUserMedia
        // This forces the Capacitor Android webview to trigger the native OS permission prompt
        let testStream: MediaStream | null = null;
        try {
          testStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          // Release the camera immediately after permission is granted
          testStream.getTracks().forEach(track => track.stop());
        } catch (permErr) {
          console.warn("Camera permission request failed or denied:", permErr);
          if (isMounted) {
            setErrorMsg("No se concedió el permiso de cámara. Por favor, habilítalo en la configuración de tu celular.");
          }
          return;
        }

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => ({
              width: Math.min(260, viewfinderWidth * 0.8),
              height: Math.min(260, viewfinderHeight * 0.8)
            })
          },
          async (decodedText) => {
            if (isSearchingRef.current) return;
            setLastScannedCode(decodedText);
            setIsSearching(true);
            setErrorMsg(null);

            try {
              const result = await lookupProductByBarcode(decodedText);
              if (result) {
                if (isMounted) {
                  if (html5QrCode.isScanning) {
                    await html5QrCode.stop().catch(() => {});
                  }
                  onProductDetected(result);
                }
              } else {
                setErrorMsg(`Código escaneado (${decodedText}) no registrado. Puedes probar con la búsqueda manual abajo o con un código demo.`);
                setIsSearching(false);
              }
            } catch (err) {
              setErrorMsg('Error al consultar la información del código.');
              setIsSearching(false);
            }
          },
          (error) => {
            // Silent frame error callback
          }
        );
      } catch (err) {
        console.warn("Failed to auto-start camera:", err);
        if (isMounted) {
          setErrorMsg("No se pudo iniciar la cámara. Otorga los permisos o escribe el código manualmente.");
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      const stopScanner = async () => {
        if (html5QrCode.isScanning) {
          try {
            await html5QrCode.stop();
          } catch (err) {
            console.warn("Error stopping scanner on cleanup:", err);
          }
        }
      };
      stopScanner();
    };
  }, []);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    const code = manualCode.trim();
    setIsSearching(true);
    setLastScannedCode(code);
    setErrorMsg(null);

    const result = await lookupProductByBarcode(code);
    if (result) {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop().catch(() => {});
      }
      onProductDetected(result);
    } else {
      setIsSearching(false);
      setErrorMsg(`No encontramos un producto registrado para el código: ${code}. Puedes registrar sus datos en el formulario principal.`);
    }
  };

  const handleSimulateScan = async (code: string) => {
    setIsSearching(true);
    setLastScannedCode(code);
    setErrorMsg(null);

    const result = await lookupProductByBarcode(code);
    if (result) {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop().catch(() => {});
      }
      onProductDetected(result);
    } else {
      setIsSearching(false);
      setErrorMsg(`No se encontró simulación para ${code}`);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', backgroundColor: 'var(--bg-primary)', zIndex: 6000, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'var(--accent-emerald)', color: '#000', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
              <QrCode size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: '#fff', lineHeight: 1.2 }}>Escáner de Código QR & Barcode</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Enfoca el producto con la cámara, ingresa el código numérico o prueba en modo demo</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: '50%' }}>
            <X size={24} />
          </button>
        </div>

        {/* Manual Barcode Input Section */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: '1rem', border: '1px solid var(--border-glass)', marginBottom: '1.5rem' }}>
          <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 240px', position: 'relative' }}>
              <Keyboard size={18} style={{ position: 'absolute', left: '0.85rem', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Ingreso manual de código (ej. 7891000100103, QR-POLLO-789012)..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.6rem', paddingRight: '1rem', height: '42px', fontSize: '0.88rem' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ height: '42px', padding: '0 1.25rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={16} />
              <span>Buscar Código</span>
            </button>
          </form>
        </div>

        {/* Camera Viewfinder */}
        <div style={{ background: '#000', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-glass)', minHeight: '280px', position: 'relative', marginBottom: '1.5rem' }}>
          <div id="qr-reader-container" style={{ width: '100%', border: 'none' }}></div>

          {isSearching && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10, 13, 20, 0.88)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: '3px solid var(--accent-emerald)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
              <p style={{ color: 'var(--accent-emerald)', fontWeight: 600, fontSize: '1.1rem' }}>
                Consultando producto: <span style={{ color: '#fff' }}>{lastScannedCode}</span>...
              </p>
            </div>
          )}
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.85rem 1rem', borderRadius: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ff8a8a', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Demo / Quick Simulation Bar */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            <Sparkles size={16} />
            <span>Botones de Demostración Rápida (Sin Cámara)</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
            Si estás probando el APK y no deseas activar la cámara en este momento, selecciona uno de estos códigos simulados para autocompletar:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.6rem' }}>
            {Object.entries(MOCK_BARCODE_DATABASE).map(([code, item]) => (
              <button
                key={code}
                type="button"
                onClick={() => handleSimulateScan(code)}
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, display: 'block', color: 'var(--text-main)' }}>{item.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>{item.quantity}{item.unit} • Vence en {item.suggestedDaysToExpiration}d</span>
                </div>
                <CheckCircle2 size={18} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Footer Back Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
          <button type="button" className="btn-secondary" onClick={onClose} style={{ padding: '0.75rem 1.5rem' }}>
            Volver al Formulario de Registro
          </button>
        </div>
      </div>
    </div>
  );
};
