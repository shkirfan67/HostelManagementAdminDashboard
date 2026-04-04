const RoomSection = ({
  buildingIndex,
  currentRooms,
  handleAddRoom,
  handleRoomClick,
  roomsLoading,
}) => {
  return (
    <div className="rooms-wrap">
      {roomsLoading && <div className="loading-rooms">Loading rooms...</div>}
      <div className="rooms">
        <div className="card add" onClick={handleAddRoom}>
          <div className="icon">+</div>
          <div className="label">Add Room</div>
        </div>

        {currentRooms.length === 0 && !roomsLoading && (
          <div className="no-rooms-message">
            No rooms found on this floor. Click "Add Room" to create one.
          </div>
        )}

        {currentRooms.map((room) => (
          <div
            key={`room-${room.id}-${room.floorId}`}
            className="card room-card"
            onClick={() => handleRoomClick(room, buildingIndex)}
          >
            <div className="meta">Room no</div>
            <div className="no">{room.number}</div>
            <div className="type">{room.type}</div>
            <div className="sharing">{room.sharing} Sharing</div>
            <div className="bed-count">
              {room.beds.length} Bed{room.beds.length !== 1 ? "s" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomSection;
