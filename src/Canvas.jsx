import React, { useEffect, useRef, useState } from 'react';

const Canvas = () => {
    const canvasRef = useRef(null);
    const [inputFunction, setInputFunction] = useState('Math.sin(x)');
    const [tempFunction, setTempFunction] = useState('Math.sin(x)');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAxes(ctx);
        drawFunction(ctx);
    }, [inputFunction]);

    const drawAxes = (ctx) => {
        ctx.beginPath();
        ctx.moveTo(canvasRef.current.width / 2, 0); 
        ctx.lineTo(canvasRef.current.width / 2, canvasRef.current.height);
        ctx.moveTo(0, canvasRef.current.height / 2); 
        ctx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
        ctx.strokeStyle = '#000';
        ctx.stroke();
    };

    const drawFunction = (ctx) => {
        const parsedFunction = new Function('x', `return ${inputFunction};`);
        ctx.beginPath();
        let step = 0.1;
    
        const displayedIntegers = new Set();
    
        for (let index = -100; index <= 100; index += step) {
            const r = parsedFunction(index);
            if (r !== undefined && !isNaN(r)) {
                ctx.lineTo(canvasRef.current.width / 2 + index * 70, canvasRef.current.height / 2 - r * 50);
                const integerPart = Math.floor(index);
                if (!displayedIntegers.has(integerPart)) {
                    ctx.fillText(integerPart, canvasRef.current.width / 2 + integerPart * 30, canvasRef.current.height / 2 + 15);
                    displayedIntegers.add(integerPart); 
                }
            }
        }
        
        ctx.strokeStyle = 'black';
        ctx.stroke();
    };

    const handleInputChange = (e) => {
        setTempFunction(e.target.value);
    };

    const handleClick = () => {
        try {
            const functionWithMath = tempFunction
                .replace(/sin\s*\(?(\d+)?\)?/g, (match, p1) => `Math.sin(${p1 ? p1 * (Math.PI / 180) : 'x'})`)
                .replace(/cos\s*\(?(\d+)?\)?/g, (match, p1) => `Math.cos(${p1 ? p1 * (Math.PI / 180) : 'x'})`)
                .replace(/tan\s*\(?(\d+)?\)?/g, (match, p1) => `Math.tan(${p1 ? p1 * (Math.PI / 180) : 'x'})`)
                .replace(/([\w]+)(?=\s*\(\d+\))/g, (match) => `Math.${match}`); 

            new Function('x', `return ${functionWithMath};`);
            setInputFunction(functionWithMath);
            setIsError(false);
        } catch (error) {
            setIsError(true);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "20px", fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Function Grapher</h2>
            <input 
                type="text" 
                value={tempFunction}
                onChange={handleInputChange} 
                placeholder="Enter function (e.g., sin(x), sin(30), sin30)"
                style={{
                    marginBottom: '10px',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '300px',
                    fontSize: '16px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                }}
            />
            <button 
                onClick={handleClick} 
                style={{
                    padding: '10px 20px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#007BFF'}
            >
                Draw Function
            </button>
            {isError && <p style={{ color: 'red', marginTop: '10px' }}>Invalid function! Please enter a valid JavaScript expression.</p>}
            <canvas ref={canvasRef} width={700} height={700} style={{ border: '1px solid #000', marginTop: '20px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} />
        </div>
    );
};

export default Canvas;
