import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BookingProgress = ({ step, setStep }) => (
    <div className="flex items-center mb-6">
        {step > 1 && step < 5 && (
            <Button variant="ghost" size="icon" className="mr-4" onClick={() => setStep(s => s - 1)}>
                <ArrowLeft />
            </Button>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
                className="bg-primary h-2.5 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(step - 1) * 25}%` }}
                transition={{ ease: "easeInOut", duration: 0.5 }}
            />
        </div>
    </div>
);

export default BookingProgress;