import React from "react";
import { MdDelete } from "react-icons/md";
import FloorSection from "../Floors/FloorSection";
import RoomSection from "../Rooms/RoomList";

const BuildingSection = ({
  building,
  buildingIndex,
  floorsByBuilding,
  openAddFloorModal,
  handleDeleteBuilding,
  handleAddRoom,
  handlePrevPage,
  handleNextPage,
  getCurrentRooms,
  handleRoomClick,
  handleTabChange,
  handleFloorChange,
  roomsLoading,
  totalRoomsForCurrentFloor,
  // Remove handleDeleteRoom prop
}) => {
  const currentRooms = getCurrentRooms(building);
  const totalPages = Math.ceil(totalRoomsForCurrentFloor / building.roomsPerPage) || 1;
  const hasNextPage = building.currentPage < totalPages - 1;
  const hasPrevPage = building.currentPage > 0;

  return (
    <section className="building">
      <div className="building-header">
        <h2>{building.name}</h2>
        <button
          className="btn-delete-building"
          onClick={() => handleDeleteBuilding(building.id)}
          title="Delete building"
        >
          <MdDelete size={20} />
          Delete Building
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {building.tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab ${building.activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabChange(buildingIndex, tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Floor Navigation */}
      <FloorSection
        building={building}
        floorsByBuilding={floorsByBuilding}
        handleFloorClick={(floor) => handleFloorChange(buildingIndex, floor)}
        openAddFloorModal={() => openAddFloorModal(building.id)}
      />

      {/* Rooms Section */}
      <RoomSection
        building={building}
        buildingIndex={buildingIndex}
        currentRooms={currentRooms}
        handleAddRoom={() => handleAddRoom(buildingIndex)}
        handleRoomClick={handleRoomClick}
        roomsLoading={roomsLoading}
        // Remove handleDeleteRoom prop
      />

      {/* Pagination Controls */}
      {(hasPrevPage || hasNextPage) && (
        <div className="pagination-controls">
          <button
            className={`pagination-btn ${!hasPrevPage ? "disabled" : ""}`}
            onClick={() => handlePrevPage(buildingIndex)}
            disabled={!hasPrevPage}
          >
            ← Previous
          </button>

          <span className="page-indicator">
            Page {building.currentPage + 1} of {totalPages}
          </span>

          <button
            className={`pagination-btn ${!hasNextPage ? "disabled" : ""}`}
            onClick={() => handleNextPage(buildingIndex)}
            disabled={!hasNextPage}
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
};

export default BuildingSection;