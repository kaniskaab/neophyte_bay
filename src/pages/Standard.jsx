import React, { useState, useEffect } from 'react';
import img1 from '../images/bg.jpg';

export default function Standard() {
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [categories, setCategories] = useState(["Brand 1", "Brand 2"]); // Initial array of categories
  const [undoStack, setUndoStack] = useState([]);

  useEffect(() => {
    // You can fetch categories from an API or any other source here
    // For simplicity, setting initial categories
    setCategories(["Brand 1", "Brand 2"]);
  }, []);

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    const container = document.getElementById('canvas-container');
    const containerRect = container.getBoundingClientRect();
    setCurrentShape({
      type: 'rectangle',
      color: 'blue',
      startX: clientX - containerRect.left,
      startY: clientY - containerRect.top,
      endX: clientX - containerRect.left,
      endY: clientY - containerRect.top,
      name: `Bay ${shapes.length + 1}`,
      category: ''
    });
    setDrawing(true);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;
    const { clientX, clientY } = event;
    const container = document.getElementById('canvas-container');
    const containerRect = container.getBoundingClientRect();
    setCurrentShape((prevShape) => ({
      ...prevShape,
      endX: clientX - containerRect.left,
      endY: clientY - containerRect.top,
    }));
  };

  const handleMouseUp = () => {
    if (!drawing) return;
    setDrawing(false);
    const newShape = { ...currentShape };
    delete newShape.type; // Remove the 'type' property before adding to shapes
    setShapes([...shapes, newShape]);
    setCurrentShape(null);
    console.log(
      `Coordinates of ${newShape.name}: Xo axis=${newShape.startX}, Yo axis=${newShape.startY},  width=${newShape.endX - newShape.startX}, height=${newShape.endY - newShape.startY}`
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
    setUndoStack(undoStack.slice(0, -1));
    setShapes(prevState);
  };

  const handleUndoAll = () => {
    setShapes([]);
    setUndoStack([]);
  };

  const handleDelete = (index) => {
    const newShapes = [...shapes];
    newShapes.splice(index, 1);
    setShapes(newShapes);
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
    <div className='flex flex-row'>
      <div className='draw-region w-4/5 h-[100vh] bg-black flex items-center justify-center overflow-scroll'>
        <div className='h-full w-full flex items-center justify-center' style={{
          backgroundImage: `url(${img1})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
        }}>
            {/* drawing region */}
          <div className='relative h-[67%] -mt-6 w-[98%] border'
            id="canvas-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {shapes.map((shape, index) => {
              const width = shape.endX - shape.startX;
              const height = shape.endY - shape.startY;
              return (
                <div
                  key={index}
                  className="absolute border"
                  style={{
                    left: shape.startX,
                    top: shape.startY,
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
            {drawing && (
              <div
                className="absolute border"
                style={{
                  left: currentShape.startX,
                  top: currentShape.startY,
                  width: currentShape.endX - currentShape.startX,
                  height: currentShape.endY - currentShape.startY,
                  borderColor: currentShape.color,
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="sidebar w-1/5 h-[100vh] bg-gray-200">
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
        </div>
      </div>
    </div>
  );
}
