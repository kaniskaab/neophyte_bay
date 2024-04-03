import React, { useState, useEffect } from 'react';
import img1 from '../images/bg.jpg';

export default function Standard() {
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [categories, setCategories] = useState(["Brand 1", "Brand 2"]); // Initial array of categories
  const [undoStack, setUndoStack] = useState([]);
  const[queue,setQueue]=useState([]);

  useEffect(() => {
    // You can fetch categories from an API or any other source here
    // For simplicity, setting initial categories
    setCategories(["Brand 1", "Brand 2"]);
    queue.sort((a,b)=>a-b);
  }, [queue]);

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    const container = document.getElementById('canvas-container');
    const containerRect = container.getBoundingClientRect();
    // console.log(containerRect);
    // console.log(clientX + "  "+ clientY)
    setCurrentShape({
      type: 'rectangle',
      color: 'blue',
      startX: clientX - containerRect.left,
      startY: clientY - containerRect.top,
      endX: clientX - containerRect.left,
      endY: clientY - containerRect.top,
      name:queue.length!==0?`Bay ${queue.shift()}`:`Bay ${shapes.length+1}`,
      category: ''
    });
    setDrawing(true);
  };

  const handleSort=()=>{
   let newShapes = [...shapes];
    for(let i=0;i<newShapes.length;i++){
      for(let j=0;j<newShapes.length;j++){
        if(parseInt(newShapes[i].name.slice(4))<parseInt(newShapes[j].name.slice(4))){
          const tempArray = newShapes[i];
          newShapes[i]=newShapes[j];
          newShapes[j]=tempArray;
        }
      }
      setShapes(newShapes);
    }
  }

  const handleMouseMove = (event) => {
    if (!drawing) return;
    const { clientX, clientY } = event;
    // console.log(clientX+ " "+ clientY)
    
    const container = document.getElementById('canvas-container');
    const containerRect = container.getBoundingClientRect();
    // console.log(clientX + " "+ containerRect.width);
    clientX-60>=containerRect.width || clientY-20>= containerRect.height?handleMouseUp(event):console.log();
    clientX<=68 || clientY<=30?handleMouseUp(event):console.log();

    
    setCurrentShape((prevShape) => ({
      ...prevShape,
      endX: clientX - containerRect.left,
      endY: clientY - containerRect.top,
    }));
  };
  

  const handleMouseUp = () => {
    if (!drawing) return;
    setDrawing(false);
    const width = Math.abs(currentShape.endX - currentShape.startX);
    const height = Math.abs(currentShape.endY - currentShape.startY);
    const startX = Math.min(currentShape.startX, currentShape.endX);
    const startY = Math.min(currentShape.startY, currentShape.endY);
    const newShape = {
      ...currentShape,
      startX,
      startY,
      endX: startX + width, 
      endY: startY + height, 
    };
    delete newShape.type; 
    setShapes([...shapes, newShape]);
    setCurrentShape(null);
    console.log(
      `Coordinates of ${newShape.name}: X axis=${newShape.startX}, Y axis=${newShape.startY}, width=${width}, height=${height}`
    );
    setUndoStack([...undoStack, shapes]);
  };
  

  const handleShapeClick = (index) => {
    const newShapes = [...shapes];
    newShapes.splice(index, 1);
    setShapes(newShapes);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prevState = undoStack[undoStack.length - 1];
    prevState.forEach(item => {
      queue.forEach(name => {
          if (item && parseInt(item.name.slice(4))== name) {
            console.log("yes");
            const index = queue.indexOf(name);
            if(name!=-1){setQueue(queue.splice(index,0))};
          }
      });
  });
    // console.log(prevState)
    setUndoStack(undoStack.slice(0, -1));
    setShapes(prevState);
 

  
  
    
  };

  const handleUndoAll = () => {
    setShapes([]);
    setUndoStack([]);
    // setCount(0);
  };

  const handleDelete = (index) => {
    const newShapes = [...shapes];
    let val = parseInt(shapes[index].name.slice(4));
    newShapes.splice(index, 1);
    setShapes(newShapes);
    setQueue([...queue,val]);

    setUndoStack([...undoStack, shapes]);
   
  };
 
  const handleChangeCategory = (index, event) => {
    const newShapes = [...shapes];
    newShapes[index].category = event.target.value;
    setShapes(newShapes);
    console.log(`Category of ${newShapes[index].name} updated to: ${event.target.value}`);
    setUndoStack([...undoStack, shapes]);
  };

  return (
    <div className='flex flex-row overflow-hidden select-none'>
      <div className='draw-region w-4/5 h-[100vh] bg-black flex items-center justify-center overflow-hidden'>
        <div className='h-[90%] w-full flex items-center justify-center' style={{
          backgroundImage: `url(${img1})`, 
          backgroundSize: 'contain',
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
        }}>
            {/* drawing region */}
          <div
            className='relative h-full w-[87%] border'
            id="canvas-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {shapes.map((shape, index) => {
              const width = Math.abs(shape.endX - shape.startX);
              const height = Math.abs(shape.endY - shape.startY);
              const left = Math.min(shape.startX, shape.endX);
              const top = Math.min(shape.startY, shape.endY);
              return (
                <div
                  key={index}
                  className="absolute border"
                  style={{
                    left,
                    top,
                    width,
                    height,
                    borderColor: shape.color,
                  }}
                  onClick={() => handleShapeClick(index)}
                >
                  <span className="absolute -bottom-10 -left-[30px] bg-white px-1 text-xs flex flex-col items-center justify-center rounded-xl">
                    <span>{shape.name}</span>
                    <span> {shape.category && (
                      <span className="ml-1 text-xxs text-gray-500">({shape.category})</span>
                    )}</span>
                  </span>
                </div>
              );
            })}
            {drawing && currentShape && (
  <div
    className="absolute border"
    style={{
      left: Math.min(currentShape.startX, currentShape.endX),
      top: Math.min(currentShape.startY, currentShape.endY),
      width: Math.abs(currentShape.endX - currentShape.startX),
      height: Math.abs(currentShape.endY - currentShape.startY),
      borderColor: currentShape.color,
    }}
  />
)}
          </div>
        </div>
      </div>
      <div className="sidebar w-1/5 h-[100vh] bg-gray-200 overflow-y-scroll">
        <h2 className="text-sm font-bold mb-2 text-gray-800 px-4 py-2 border-b">Bay List</h2>
        <ul className="list-none px-0">
          {shapes.map((shape, index) => (
            <li key={index} className="flex items-center justify-between py-2 border-b">
              <div className="text-sm text-gray-700 px-4">
                <span>{shape.name}</span>
                {shape.category && (
                  <span className="ml-2 text-xs text-gray-500">({shape.category})</span>
                )}
              </div>
              <div className="flex items-center">
                <select
                  value={shape.category}
                  onChange={(event) => handleChangeCategory(index, event)}
                  className="rounded border border-gray-400 mr-2 text-sm text-gray-700"
                >
                  <option value="">Select Category</option>
                  {categories.map((category, i) => (
                    <option key={i} value={category}>{category}</option>
                  ))}
                </select>
                <button onClick={() => handleDelete(index)} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition duration-300 text-sm">X</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-4">
          <button onClick={handleUndo} className="px-3 py-1 rounded bg-gray-300 text-gray-700 mr-2 hover:bg-gray-400 transition duration-300 text-sm">Undo</button>
          <button onClick={handleUndoAll} className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-300 text-sm">Undo All</button>
          <button onClick={handleSort} className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-300 text-sm">Sort</button>

        </div>
      </div>
    </div>
  );
}
