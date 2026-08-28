"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Mail, User, Phone, Home, MessageSquare, Zap, Award, ChevronRight } from 'lucide-react';

const QuickQuote = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [step, setStep] = useState(1);

    // Project types for dropdown
    const projectTypes = [
        { value: 'residential', label: 'Residential Lighting' },
        { value: 'commercial', label: 'Commercial Lighting' },
        { value: 'holiday', label: 'Holiday Decor' },
        { value: 'permanent', label: 'Permanent Installation' },
        { value: 'repair', label: 'Repair & Maintenance' },
        { value: 'consultation', label: 'Free Consultation' }
    ];

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const showSuccess = () => {
        setIsSuccess(true);
        setFormData({
            name: '',
            email: '',
            phone: '',
            projectType: '',
            message: ''
        });
        setStep(1);

        setTimeout(() => {
            setIsSuccess(false);
            setIsOpen(false);
        }, 3000);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const emailContent = `
🎄 NEW QUICK QUOTE REQUEST - CHRISTMAS LIGHTING

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Project Type: ${projectTypes.find(t => t.value === formData.projectType)?.label || 'Not specified'}

📝 MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Submitted: ${new Date().toLocaleString()}
🌐 Source: Quick Quote Widget
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

        try {
            // Also send to internal contact API for CRM storage
            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fname: formData.name.split(' ')[0] || formData.name,
                    lname: formData.name.split(' ').slice(1).join(' ') || '',
                    email: formData.email,
                    phone: formData.phone,
                    service: projectTypes.find(t => t.value === formData.projectType)?.label || formData.projectType,
                    message: formData.message,
                    source: 'Quick Quote Widget'
                })
            }).catch(() => {});

            // Try FormSubmit
            try {
                const response = await fetch('https://formsubmit.co/ajax/Info@lightsovercolumbus.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: `🎄 Quick Quote - ${formData.name}`,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        project_type: projectTypes.find(t => t.value === formData.projectType)?.label,
                        message: formData.message,
                        _template: 'table',
                        _captcha: 'false'
                    })
                });

                if (response.ok) {
                    showSuccess();
                    return;
                }
            } catch (fetchError) {
                console.log('FormSubmit failed, using mailto fallback', fetchError);
            }

            // Fallback to mailto
            const mailtoLink = `mailto:Info@lightsovercolumbus.com?subject=🎄 Quick Quote - ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(emailContent)}`;
            window.location.href = mailtoLink;
            showSuccess();

        } catch (error) {
            console.error('Submission error:', error);
            alert('Please email us directly at Info@lightsovercolumbus.com');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* ====================== */}
            {/* EYE-CATCHING FLOATING BUTTON - CHRISTMAS THEMED */}
            {/* ====================== */}
            <motion.button
                onClick={() => setIsOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="fixed bottom-8 right-8 z-50 group"
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 1
                }}
                aria-label="Open Quick Quote"
            >
                {/* Multiple pulsing rings - Christmas colors */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            background: `radial-gradient(circle, ${i === 0 ? 'rgba(220, 38, 38, 0.4)' : i === 1 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.2)'} 0%, transparent 70%)`,
                        }}
                        animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 2.5,
                            delay: i * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}

                {/* Floating particles around button */}
                {isHovered && (
                    <>
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 rounded-full pointer-events-none"
                                style={{
                                    background: i % 3 === 0 ? '#dc2626' : i % 3 === 1 ? '#22c55e' : '#eab308'
                                }}
                                initial={{
                                    x: 0,
                                    y: 0,
                                    scale: 0,
                                    opacity: 0.8
                                }}
                                animate={{
                                    x: Math.cos(i * 45 * (Math.PI / 180)) * 60,
                                    y: Math.sin(i * 45 * (Math.PI / 180)) * 60,
                                    scale: [0, 1.5, 0],
                                    opacity: [0, 0.8, 0]
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </>
                )}

                {/* Main button - Christmas gradient */}
                <motion.div
                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-red-600 via-green-600 to-yellow-500 shadow-2xl flex items-center justify-center cursor-pointer border-2 border-white/30"
                    animate={{
                        boxShadow: isHovered
                            ? '0 30px 50px -15px rgba(220,38,38,0.7), 0 0 0 3px rgba(255,255,255,0.4)'
                            : '0 20px 40px -12px rgba(34,197,94,0.5)',
                        rotate: isHovered ? [0, -5, 5, -5, 5, 0] : 0
                    }}
                    transition={{
                        rotate: {
                            duration: 0.5,
                            repeat: isHovered ? Infinity : 0,
                            repeatType: "mirror"
                        }
                    }}
                >
                    {/* Inner glow */}
                    <motion.div
                        className="absolute inset-2 rounded-full bg-white/20 blur-md pointer-events-none"
                        animate={{
                            scale: isHovered ? 1.2 : 1,
                            opacity: isHovered ? 0.8 : 0.4
                        }}
                    />

                    {/* Icon */}
                    <motion.div
                        animate={{
                            rotate: isHovered ? 360 : 0,
                            scale: isHovered ? 1.2 : 1
                        }}
                        transition={{
                            rotate: {
                                duration: 2,
                                repeat: isHovered ? Infinity : 0,
                                ease: "linear"
                            }
                        }}
                        className="relative z-10"
                    >
                        <Zap className="w-7 h-7 md:w-9 md:h-9 text-white" />
                    </motion.div>

                    {/* Notification dot */}
                    <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white pointer-events-none"
                        animate={{
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Tooltip - Premium */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.8 }}
                                transition={{ type: "spring", damping: 15 }}
                                className="absolute right-20 top-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-2xl whitespace-nowrap shadow-2xl border border-red-500/30 pointer-events-none"
                            >
                                <span className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                    Free Christmas Quote
                                    <ChevronRight className="w-4 h-4 text-green-500" />
                                </span>
                                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-gray-800 to-gray-900 rotate-45 border-r border-t border-red-500/30" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.button>

            {/* ====================== */}
            {/* PREMIUM MODAL - CHRISTMAS THEMED */}
            {/* ====================== */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop with blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
                        />

                        {/* Modal Container */}
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-[101]">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 300,
                                    mass: 1
                                }}
                                className="relative w-full max-w-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Animated background rings - Christmas colors */}
                                <motion.div
                                    className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-red-500/30 via-green-500/30 to-yellow-500/30 blur-2xl pointer-events-none"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: [0.3, 0.5, 0.3]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                                {/* Main modal */}
                                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-500/10">
                                    {/* Decorative header gradient - Christmas */}
                                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-500/5 via-green-500/5 to-transparent pointer-events-none" />

                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-red-500/20 rounded-tl-3xl pointer-events-none" />
                                    <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-green-500/20 rounded-tr-3xl pointer-events-none" />

                                    {/* Close button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsOpen(false)}
                                        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors border border-gray-200"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </motion.button>

                                    {/* Success overlay */}
                                    <AnimatePresence>
                                        {isSuccess && (
                                            <motion.div
                                                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                                                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                                className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center p-8"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{
                                                        type: "spring",
                                                        damping: 15,
                                                        stiffness: 200
                                                    }}
                                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-yellow-500 flex items-center justify-center mb-6 shadow-2xl shadow-red-500/30"
                                                >
                                                    <motion.svg
                                                        className="w-12 h-12 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        initial={{ pathLength: 0 }}
                                                        animate={{ pathLength: 1 }}
                                                        transition={{ duration: 0.8, delay: 0.2 }}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </motion.svg>
                                                </motion.div>

                                                <motion.h3
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="text-2xl font-bold text-gray-900 mb-2"
                                                >
                                                    Quote Request Sent!
                                                </motion.h3>

                                                <motion.p
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                    className="text-gray-600 text-center"
                                                >
                                                    We'll respond within 4-8 hours.
                                                </motion.p>

                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-1 bg-red-500/20 rounded-full overflow-hidden"
                                                >
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-red-500 via-green-500 to-yellow-500"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 3, ease: "linear" }}
                                                    />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Form content */}
                                    <div className="relative p-8 md:p-10">
                                        {/* Header */}
                                        <motion.div
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="mb-8"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                                    <Award className="w-5 h-5 text-red-500" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 via-green-600 to-yellow-600 bg-clip-text text-transparent">
                                                        Free Christmas Quote
                                                    </h2>
                                                    <p className="text-sm text-gray-500">Get your festive estimate in minutes</p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Step Indicator - Premium */}
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="relative mb-8"
                                        >
                                            <div className="flex items-center justify-between">
                                                {[1, 2, 3].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="flex flex-col items-center"
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.2 + i * 0.1 }}
                                                    >
                                                        <motion.div
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${i <= step
                                                                    ? i === 1 ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                                                        : i === 2 ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                                                            : 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                                                                    : 'bg-gray-100 text-gray-400'
                                                                }`}
                                                            animate={i === step ? {
                                                                scale: [1, 1.1, 1],
                                                                boxShadow: [
                                                                    `0 4px 6px -1px ${i === 1 ? 'rgba(220,38,38,0.1)' : i === 2 ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)'}`,
                                                                    `0 10px 15px -3px ${i === 1 ? 'rgba(220,38,38,0.3)' : i === 2 ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)'}`,
                                                                    `0 4px 6px -1px ${i === 1 ? 'rgba(220,38,38,0.1)' : i === 2 ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)'}`
                                                                ]
                                                            } : {}}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }}
                                                        >
                                                            {i}
                                                        </motion.div>
                                                        <span className="text-xs font-medium text-gray-500 hidden md:block">
                                                            {i === 1 ? 'Details' : i === 2 ? 'Project' : 'Message'}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Progress bar */}
                                            <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-200 -z-10 hidden md:block">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-red-500 via-green-500 to-yellow-500"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: `${((step - 1) / 2) * 100}%` }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Form */}
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <AnimatePresence mode="wait">
                                                {step === 1 && (
                                                    <motion.div
                                                        key="step1"
                                                        initial={{ opacity: 0, x: 50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -50 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="space-y-4"
                                                    >
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                <User className="w-4 h-4 inline mr-2 text-red-500" />
                                                                Your Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={formData.name}
                                                                onChange={handleInputChange}
                                                                required
                                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-gray-900"
                                                                placeholder="John Doe"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                <Mail className="w-4 h-4 inline mr-2 text-green-500" />
                                                                Email Address
                                                            </label>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                                required
                                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-gray-900"
                                                                placeholder="john@example.com"
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {step === 2 && (
                                                    <motion.div
                                                        key="step2"
                                                        initial={{ opacity: 0, x: 50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -50 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="space-y-4"
                                                    >
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                <Phone className="w-4 h-4 inline mr-2 text-yellow-500" />
                                                                Phone Number
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                name="phone"
                                                                value={formData.phone}
                                                                onChange={handleInputChange}
                                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all text-gray-900"
                                                                placeholder="(123) 456-7890"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                <Home className="w-4 h-4 inline mr-2 text-red-500" />
                                                                Project Type
                                                            </label>
                                                            <select
                                                                name="projectType"
                                                                value={formData.projectType}
                                                                onChange={handleInputChange}
                                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-gray-900 appearance-none"
                                                            >
                                                                <option value="">Select project type</option>
                                                                {projectTypes.map(type => (
                                                                    <option key={type.value} value={type.value}>
                                                                        {type.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {step === 3 && (
                                                    <motion.div
                                                        key="step3"
                                                        initial={{ opacity: 0, x: 50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -50 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="space-y-4"
                                                    >
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                <MessageSquare className="w-4 h-4 inline mr-2 text-yellow-500" />
                                                                Tell us about your project
                                                            </label>
                                                            <textarea
                                                                name="message"
                                                                value={formData.message}
                                                                onChange={handleInputChange}
                                                                required
                                                                rows={5}
                                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-gray-900 resize-none"
                                                                placeholder="Briefly describe your lighting needs..."
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Navigation buttons - Premium */}
                                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                                {step > 1 && (
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => setStep(step - 1)}
                                                        className="group px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                                                        whileHover={{ x: -3 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <ChevronRight className="w-4 h-4 rotate-180" />
                                                        Back
                                                    </motion.button>
                                                )}

                                                {step < 3 ? (
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => setStep(step + 1)}
                                                        className="ml-auto px-8 py-3 bg-gradient-to-r from-red-500 via-green-500 to-yellow-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                                        whileHover={{ scale: 1.02, x: 3 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        Continue
                                                        <ChevronRight className="w-4 h-4" />
                                                    </motion.button>
                                                ) : (
                                                    <motion.button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="ml-auto px-8 py-3 bg-gradient-to-r from-red-500 via-green-500 to-yellow-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Get Free Quote
                                                                <Send className="w-4 h-4" />
                                                            </>
                                                        )}
                                                    </motion.button>
                                                )}
                                            </div>

                                            {/* Trust badges */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="flex items-center justify-center gap-4 pt-4 text-xs"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                                    <span className="text-gray-500">Free estimate</span>
                                                </div>
                                                <div className="w-px h-3 bg-gray-200" />
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                    <span className="text-gray-500">4-8h response</span>
                                                </div>
                                                <div className="w-px h-3 bg-gray-200" />
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                                                    <span className="text-gray-500">No obligation</span>
                                                </div>
                                            </motion.div>
                                        </form>
                                    </div>

                                    {/* Bottom accent */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-green-500 to-yellow-500" />
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default QuickQuote;