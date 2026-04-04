import React from "react";

const FloorSection = ({
  building,
  floorsByBuilding,
  handleFloorClick, // Make sure this prop is received
  openAddFloorModal,
}) => {
  const backendFloors = floorsByBuilding[building.id];

  const floorsToShow =
    Array.isArray(backendFloors) && backendFloors.length > 0
      ? backendFloors.map((f) => ({
          id: f.id,
          floorNo: f.floorNo,
        }))
      : building.floors.map((label, index) => ({
          id: index,
          floorNo: label.replace("Floor ", ""),
        }));

  return (
    <div className="floors">
      <div className="floor-list">
        {floorsToShow.map((floor, index) => (
          <div
            key={floor.id || index}
            className={`floor ${
              building.activeFloor === `Floor ${floor.floorNo}` ? "active" : ""
            }`}
            onClick={() => handleFloorClick(`Floor ${floor.floorNo}`)} // Make sure this is called
          >
            Floor {floor.floorNo}
          </div>
        ))}
      </div>
      
      <button
        className="btn-add-floor"
        onClick={() => openAddFloorModal(building.id)}
      >
        + Add Floor
      </button>
    </div>
  );
};

export default FloorSection;