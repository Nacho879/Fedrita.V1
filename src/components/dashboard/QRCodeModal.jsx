import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const QRCodeModal = ({ bookingUrl, salonName }) => {
  const qrRef = useRef(null);

  const handleDownload = () => {
    const qrCanvas = qrRef.current.querySelector('canvas');
    if (!qrCanvas) return;

    const compositeCanvas = document.createElement('canvas');
    const qrWidth = qrCanvas.width;
    const qrHeight = qrCanvas.height;
    const padding = 40;
    const headerHeight = 90;
    const footerHeight = 50;

    compositeCanvas.width = qrWidth + padding * 2;
    compositeCanvas.height = qrHeight + headerHeight + footerHeight;

    const ctx = compositeCanvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);

    ctx.fillStyle = 'black';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(salonName, compositeCanvas.width / 2, 40);

    ctx.font = '22px sans-serif';
    ctx.fillText('Reserva turno', compositeCanvas.width / 2, 75);

    ctx.drawImage(qrCanvas, padding, headerHeight);

    ctx.font = '18px sans-serif';
    ctx.fillText('www.fedrita.com', compositeCanvas.width / 2, headerHeight + qrHeight + 25);

    const pngUrl = compositeCanvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qr-reservas-${salonName.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader className="text-center">
        <DialogTitle className="text-2xl font-bold">{salonName}</DialogTitle>
        <DialogDescription>
          Reserva turno
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center py-4">
        <div ref={qrRef} className="p-4 bg-white rounded-lg border shadow-sm">
          <QRCodeCanvas
            value={bookingUrl}
            size={256}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={true}
          />
        </div>
        <p className="mt-4 text-sm text-gray-600 font-medium">www.fedrita.com</p>
      </div>
      <DialogFooter className="sm:justify-center">
        <Button type="button" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Descargar QR
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default QRCodeModal;