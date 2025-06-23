import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const UploadDocuments = () => {
  const { toast } = useToast();
  const employees = [
    { id: '1', name: 'Ana García' },
    { id: '2', name: 'Luis Pérez' },
  ];

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  }

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedEmployee || !documentType || !file) {
        toast({
            title: "Campos incompletos",
            description: "Por favor, selecciona un empleado, un tipo de documento y un archivo.",
            variant: "destructive",
        });
        return;
    }
    toast({
      title: "Función no implementada 🚧",
      description: "La subida de documentos aún no está conectada. ¡Podrás solicitarlo en tu próximo prompt! 🚀",
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <FilePlus className="mr-3 h-8 w-8 text-primary" />
              Subir Documentos de Empleado
            </CardTitle>
            <CardDescription>
              Sube contratos, nóminas u otros documentos importantes para tus empleados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <Label htmlFor="employee-select">Empleado</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger id="employee-select">
                    <SelectValue placeholder="Seleccionar un empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="document-type">Tipo de Documento</Label>
                <Input
                  id="document-type"
                  type="text"
                  placeholder="Ej: Contrato, Nómina, Certificado..."
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="file-upload">Archivo (PDF o Imagen)</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                      >
                        <span>Sube un archivo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,image/*" required/>
                      </label>
                      <p className="pl-1">o arrástralo aquí</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PDF, PNG, JPG hasta 10MB</p>
                    {fileName && <p className="text-sm text-gray-800 mt-2 font-medium">{fileName}</p>}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full text-lg py-6">
                <UploadCloud className="mr-2 h-5 w-5" />
                Subir Documento
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UploadDocuments;