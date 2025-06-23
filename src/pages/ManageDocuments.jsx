import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FilePlus, Trash2, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";

const ManageDocuments = () => {
  const { toast } = useToast();
  const employees = [
    { id: '1', name: 'Ana García' },
    { id: '2', name: 'Luis Pérez' },
  ];

  const allDocuments = {
    '1': [
      { id: 1, tipo: "Nómina", nombre: "nómina-marzo-2025.pdf", fecha: "2025-04-05", url: "#" },
      { id: 2, tipo: "Contrato", nombre: "contrato-indefinido.pdf", fecha: "2024-01-15", url: "#" },
    ],
    '2': [
      { id: 3, tipo: "Certificado", nombre: "certificado-manipulador-alimentos.pdf", fecha: "2023-06-20", url: "#" }
    ]
  };

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [employeeDocuments, setEmployeeDocuments] = useState([]);

  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployee(employeeId);
    setEmployeeDocuments(allDocuments[employeeId] || []);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

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
    setDocumentType('');
    setFile(null);
    setFileName('');
  };

  const handleAction = (action, docName) => {
    toast({
      title: "Función no implementada 🚧",
      description: `La acción de ${action} para "${docName}" aún no está lista.`,
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <FilePlus className="mr-3 h-8 w-8 text-primary" />
              Subir Nuevo Documento
            </CardTitle>
            <CardDescription>
              Selecciona un empleado y sube un nuevo documento a su perfil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="employee-select-upload">Empleado</Label>
                  <Select value={selectedEmployee} onValueChange={handleEmployeeChange}>
                    <SelectTrigger id="employee-select-upload">
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
                    placeholder="Ej: Contrato, Nómina..."
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    required
                  />
                </div>
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

        <Card>
          <CardHeader>
            <CardTitle>Documentos del Empleado</CardTitle>
            <CardDescription>
              Visualiza, descarga o elimina los documentos del empleado seleccionado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedEmployee ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>Por favor, selecciona un empleado para ver sus documentos.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre del Documento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha de subida</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeDocuments.length > 0 ? (
                      employeeDocuments.map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            {doc.nombre}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{doc.tipo}</Badge>
                          </TableCell>
                          <TableCell>{doc.fecha}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="icon" variant="ghost" onClick={() => handleAction('descargar', doc.nombre)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleAction('eliminar', doc.nombre)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="4" className="text-center h-32">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-muted-foreground">Este empleado no tiene documentos.</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ManageDocuments;