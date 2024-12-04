export function SkeletonList() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
                <div className="w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-1/3 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
        </div>
    )
}