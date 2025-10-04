export default function InstructionsCard({ title, instruction }: { title: string, instruction: string }) {
    return (
        <div className="h-full w-full mt-8">
        <div className="w-full h-1/2 bg-white/30 sticky top-1/4 rounded-4xl">
            <div className="w-full h-full grid grid-cols-3 gap-4 px-16">
                <h2 className="text-9xl font-hardbop font-bold tracking-[0.015em] text-white col-span-1 flex items-center">{title}</h2>
                <p className="text-6xl font-hardbop font-bold tracking-[0.015em] text-white col-span-2 flex items-center">
                    {instruction}
                </p>
            </div>
        </div>
        </div>
    )
}