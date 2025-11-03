export default function TestCSS() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-white">CSS Test Page</h1>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Tailwind CSS Test
                    </h2>
                    <p className="text-gray-600">
                        If you can see this text styled with proper spacing, colors, and background,
                        then Tailwind CSS is working correctly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-500 text-white p-4 rounded-lg">
                        <h3 className="font-bold">Red Card</h3>
                        <p>This should be red</p>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded-lg">
                        <h3 className="font-bold">Green Card</h3>
                        <p>This should be green</p>
                    </div>
                    <div className="bg-blue-500 text-white p-4 rounded-lg">
                        <h3 className="font-bold">Blue Card</h3>
                        <p>This should be blue</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                        Hover Me
                    </button>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors">
                        Click Me
                    </button>
                </div>
            </div>
        </div>
    );
}
