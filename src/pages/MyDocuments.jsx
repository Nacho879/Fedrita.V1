import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileText, UploadCloud, FilePlus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MyDocuments = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { userRole } = useAuth();

    const [documentType, setDocumentType] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const documents = [
      {
        id: 1,
        tipo: "Nómina",
        nombre: "nómina-marzo-2025.pdf",
        fecha: "2025-04-05",
        url: "#",
      },
      {
        id: 2,
        tipo: "Contrato",
        nombre: "contrato-indefinido.pdf",
        fecha: "2024-01-15",
        url: "#",
      },
      {
        id: 3,
        tipo: "Certificado",
        nombre: "certificado-manipulador-alimentos.pdf",
        fecha: "2023-06-20",
        url: "#",
      }
    ];

    const handleDownload = (doc) => {
        toast({
            title: "Función no implementada 🚧",
            description: `La descarga del documento "${doc.nombre}" aún no está lista.`,
        });
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
        if (!documentType || !file) {
            toast({
                title: "Campos incompletos",
                description: "Por favor, especifica un tipo de documento y un archivo.",
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

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="ml-4">
                        <h1 className="text-4xl font-bold text-hub-anthracite">Mis Documentos</h1>
                        <p className="text-foreground text-lg">Consulta y descarga tus documentos laborales.</p>
                    </div>
                </div>

                {userRole === 'manager' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center">
                                <FilePlus className="mr-3 h-7 w-7 text-primary" />
                                Subir Documento Personal
                            </CardTitle>
                            <CardDescription>
                                Sube tus propias nóminas u otros documentos para tenerlos a mano.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <Label htmlFor="document-type">Tipo de Documento</Label>
                                    <Input
                                        id="document-type"
                                        type="text"
                                        placeholder="Ej: Nómina, IRPF..."
                                        value={documentType}
                                        onChange={(e) => setDocumentType(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="file-upload">Archivo</Label>
                                    <div className="mt-1 flex justify-center rounded-lg border border-dashed border-input px-6 py-6">
                                        <div className="text-center">
                                            <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                                            <div className="mt-2 flex text-sm leading-6 text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                                                >
                                                    <span>Sube un archivo</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,image/*" required />
                                                </label>
                                                <p className="pl-1">o arrástralo aquí</p>
                                            </div>
                                            {fileName ? <p className="text-sm text-gray-800 mt-2 font-medium">{fileName}</p> : <p className="text-xs leading-5 text-gray-600">PDF, PNG, JPG hasta 10MB</p>}
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                    Subir Documento
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Documentos</CardTitle>
                        <CardDescription>Aquí puedes ver todos los documentos que se han subido a tu perfil.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre del Documento</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Fecha de subida</TableHead>
                                        <TableHead className="text-right">Acción</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.length > 0 ? (
                                        documents.map(doc => (
                                            <TableRow key={doc.id}>
                                                <TableCell className="font-medium flex items-center">
                                                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    {doc.nombre}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{doc.tipo}</Badge>
                                                </TableCell>
                                                <TableCell>{doc.fecha}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm" onClick={() => handleDownload(doc)}>
                                                        <Download className="mr-2 h-4 w-4" /> Descargar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan="4" className="text-center h-32">
                                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="mt-2 text-muted-foreground">No tienes documentos disponibles todavía.</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default MyDocuments;