import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ParticleBackground from '@/components/particle-background';
import { toast } from 'sonner';
import complete from '../../../public/images/complete.png';
import clock from '../../../public/images/clock.png';
import gaming from '../../../public/images/gaming.png';

export default function WaitingRoom() {
    const { data, auth, participants } = usePage().props;
    const [isStarting, setIsStarting] = useState(false);
    const [countdown, setCountdown] = useState(null);

    const isOwner = auth?.id === data.teacher_id;
    const isWaiting = data?.status === 'waiting';
    const isComplete = data?.status === 'completed';

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['participants', 'data'] });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const startQuiz = () => {
        setIsStarting(true);
        setCountdown(5); // 5 detik countdown
        toast.success('Quiz akan dimulai dalam 5 detik!');

        setTimeout(() => {
            router.post(`/quiz/private/${data.session_id}`);
        }, 5000);
    };

    const stopQuiz = () => {
        toast.success('Quiz akan berhenti dalam 3 detik!');
        
        setTimeout(() => {
            router.post(`/quiz/private/${data.session_id}`);
        }, 3000);
    };

    const getButtonLabel = () => {
        if (isComplete) return 'Sudah Selesai';
        if (isWaiting) return isStarting ? '🚀 Memulai Quiz...' : '▶️ Mulai Quiz';
        return '⏹️ Berhenti';
    };

    const isButtonDisabled = () => {
        if (isComplete) return true;
        return countdown !== null || !participants?.length;
    };

    const handleClick = () => {
        if (isWaiting) {
            startQuiz();
        } else {
            stopQuiz();
        }
    };

    const leaveWaitingRoom = () => {
        router.visit(`/quiz/private/${data.id}`);

        if (isOwner) {
            router.visit('/quiz');
        }
    };

    useEffect(() => {
        if (!isOwner && data.status !== 'waiting') {
            router.visit(`/quiz/start/${data.id}`);
        }
    }, [data?.status]);

    return (
        <div className="container mx-auto max-w-4xl min-h-screen">
            <ParticleBackground />

            <div className="relative z-10 text-white p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">🏃‍♂️ Ruang Tunggu</h1>
                    <h2 className="text-xl text-white/80">{data.title}</h2>
                    <Badge className="mt-2 bg-blue-500">
                        👨‍🏫 {data.teacher}
                    </Badge>
                </div>

                {/* Quiz Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-2xl font-bold">
                                {participants?.length || 0}
                            </div>
                            <div className="text-sm text-white/70">
                                Peserta Terdaftar
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-2xl font-bold">
                                {data.max_participants}
                            </div>
                            <div className="text-sm text-white/70">
                                Maksimal Peserta
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-2xl font-bold">
                                {data.questions_count || 0}
                            </div>
                            <div className="text-sm text-white/70">
                                Pertanyaan
                            </div>
                        </div>
                    </div>
                </div>

                {/* Countdown */}
                {countdown !== null && (
                    <div className="text-center mb-6">
                        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6">
                            <h3 className="text-2xl font-bold mb-2">
                                ⏰ Quiz Dimulai Dalam
                            </h3>
                            <div className="text-6xl font-bold text-red-400">
                                {countdown}
                            </div>
                            <p className="mt-2 text-white/80">Bersiaplah!</p>
                        </div>
                    </div>
                )}

                {/* Participants List */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4">
                        👥 Daftar Peserta
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                        {participants && participants.length > 0 ? (
                            participants.map((participant, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 bg-white/5 rounded-lg p-3"
                                >
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                                        {participant.student.name
                                            ?.charAt(0)
                                            .toUpperCase() || '?'}
                                    </div>
                                    <div className="absolute left-[350px]">
                                        {participant.status === 'ready' && (
                                            <img
                                                src={clock}
                                                alt="waiting"
                                                className="w-1/2 h-1/2"
                                            />
                                        )}
                                        {participant.status ===
                                            'in_progress' && (
                                            <img
                                                src={gaming}
                                                alt="in progress"
                                                className="w-1/2 h-1/2"
                                            />
                                        )}
                                        {participant.status === 'completed' && (
                                            <div className="">
                                                <img
                                                    src={complete}
                                                    alt="complete"
                                                    className="w-1/2 h-1/2"
                                                />
                                            </div>
                                        )}
                                        {participant?.student?.attempts?.length > 0 && (
                                            <div className="text-xs pt-1 text-white/60">
                                                {participant.student.attempts[participant.student.attempts.length - 1].percentage} %
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {participant.student.name}
                                        </div>
                                        <div className="text-xs text-white/60">
                                            Bergabung: {participant.joined_at}
                                        </div>
                                    </div>
                                    {participant.id === data.user_id && (
                                        <Badge className="ml-auto bg-yellow-500 text-black">
                                            Host
                                        </Badge>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center text-white/60 py-8">
                                Belum ada peserta yang bergabung
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    {isOwner ? (
                        <Button
                            onClick={handleClick}
                            disabled={isButtonDisabled()}
                            className={`
                                ${isWaiting ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                                text-white px-8 py-3 text-lg font-semibold
                            `}
                        >
                        {getButtonLabel()}
                        </Button>
                    ) : (
                        <div className="text-center">
                            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                                <p className="text-white/80">
                                    ⏳ Menunggu host untuk memulai quiz...
                                </p>
                            </div>
                        </div>
                    )}

                    <Button
                        onClick={leaveWaitingRoom}
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
                        disabled={countdown !== null}
                    >
                        🚪 Keluar
                    </Button>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">📋 Instruksi:</h4>
                    <ul className="text-sm text-white/80 space-y-1">
                        <li>• Pastikan koneksi internet Anda stabil</li>
                        <li>• Jangan refresh halaman selama menunggu</li>
                        <li>
                            • Quiz akan dimulai secara bersamaan untuk semua
                            peserta
                        </li>
                        <li>
                            •{' '}
                            {isOwner
                                ? 'Sebagai host, Anda dapat memulai quiz kapan saja'
                                : 'Tunggu hingga host memulai quiz'}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
