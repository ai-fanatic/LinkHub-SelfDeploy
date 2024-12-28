import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  url: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url }) => {
  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'qrcode.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <Card className="glass-card p-6 text-center fade-in">
      <div className="bg-white p-4 rounded-lg inline-block mb-4">
        <QRCodeSVG
          id="qr-code"
          value={url}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>
      <Button onClick={downloadQRCode} className="hover-scale">
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </Card>
  );
};

export default QRCodeGenerator;