import React, { useEffect, useState } from 'react';

interface ProgressCircleProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function ProgressCircle({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  className = '',
}: ProgressCircleProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Circle calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Calculate stroke dash offset for progress (starts from top, goes clockwise)
  const strokeDashoffset = circumference - (circumference * animatedValue) / 100;

  // Animate progress when value changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(progressPercentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ width: size, height: size }}
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgb(229, 231, 235)" // Tailwind gray-200
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-30"
        />
        
        {/* Progress stroke */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgb(34, 197, 94)" // Tailwind green-500
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl mb-1">🔥</span>
        <span className="text-sm font-semibold text-gray-700">
          {Math.round(progressPercentage)}%
        </span>
      </div>
    </div>
  );
}

// Example usage component for testing
export function ProgressCircleDemo() {
  const [value, setValue] = useState(684);
  const max = 2000;

  const handleIncrease = () => setValue(prev => Math.min(max, prev + 100));
  const handleDecrease = () => setValue(prev => Math.max(0, prev - 100));
  const handleReset = () => setValue(0);
  const handleFull = () => setValue(max);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Progress Circle Demo
        </h2>
        
        {/* Main Progress Circle */}
        <div className="flex justify-center mb-6">
          <ProgressCircle
            value={value}
            max={max}
            size={150}
            strokeWidth={12}
            className="drop-shadow-sm"
          />
        </div>
        
        {/* Stats */}
        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-gray-800">
            {value} / {max} calories
          </p>
          <p className="text-sm text-gray-600">
            {Math.round((value / max) * 100)}% of daily goal
          </p>
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleDecrease}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            -100
          </button>
          <button
            onClick={handleIncrease}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            +100
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleFull}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Full
          </button>
        </div>
        
        {/* Different Sizes */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
            Different Sizes
          </h3>
          <div className="flex justify-center items-center gap-6">
            <div className="text-center">
              <ProgressCircle value={value} max={max} size={80} strokeWidth={8} />
              <p className="text-xs text-gray-600 mt-2">Small</p>
            </div>
            <div className="text-center">
              <ProgressCircle value={value} max={max} size={100} strokeWidth={10} />
              <p className="text-xs text-gray-600 mt-2">Medium</p>
            </div>
            <div className="text-center">
              <ProgressCircle value={value} max={max} size={120} strokeWidth={12} />
              <p className="text-xs text-gray-600 mt-2">Large</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
