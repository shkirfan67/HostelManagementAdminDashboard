import React, { useState, useEffect, useCallback } from "react";
import "./building.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getBuildingsByHostelId,
  deleteBuildingById,
  addBuildingByHostelId,
} from "../../features/buildingSlice";

import {
  getFloorsByBuildingId,
  addFloorByBuildingId,
} from "../../features/floorSlice";

import { addRoomByFloorId, getRoomsByFloorId } from "../../features/roomSlice";

import FloorAddModal from "../Floors/FloorAddModal";
import BuildingSection from "./BuildingSection";
import BedManagementModal from "../Beds/BedManagement";
import AddRoomModal from "../Rooms/RoomAddModal";
import AddBuildingModal from "./AddBuildingModal";
import { MdRefresh } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

const BuildingManagement = () => {
  const params = useParams();
  const hostelId = params.hostelId || params.id;

  const dispatch = useDispatch();
  const [hostelName, setHostelName] = useState("");
  const {
    buildings: backendBuildings,
    loading: buildingsLoading,
    error: buildingsError,
  } = useSelector((state) => state.building);

  const {
    rooms: backendRooms,
    loading: roomsLoading,
    error: roomsError,
  } = useSelector((state) => state.room);

  const [buildings, setBuildings] = useState([]);
  const [floorsByBuilding, setFloorsByBuilding] = useState({});
  const [showFloorModal, setShowFloorModal] = useState(false);
  const [floorForm, setFloorForm] = useState({ floorNo: "", roomCount: "" });
  const [floorModalForBuildingId, setFloorModalForBuildingId] = useState(null);
  const [activeBuildingIndex, setActiveBuildingIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBedManagement, setShowBedManagement] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [roomForm, setRoomForm] = useState({
    roomNo: "",
    sharing: "",
    type: "CLA",
  });
  const [roomModalForFloorId, setRoomModalForFloorId] = useState(null);
  const [roomsByFloor, setRoomsByFloor] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
  const [buildingForm, setBuildingForm] = useState({
    name: "",
    floorCount: "",
    wardenName: "",
    wardenEmail: "",
    wardenContactNo: "",
  });

  const fetchAllData = useCallback(async () => {
    if (!hostelId) return;

    console.log("Refreshing all data...");
    setIsRefreshing(true);

    try {
      await dispatch(getBuildingsByHostelId(hostelId)).unwrap();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, hostelId]);

  useEffect(() => {
    if (!hostelId) return;
    console.log("Fetching buildings for hostel:", hostelId);
    dispatch(getBuildingsByHostelId(hostelId));
  }, [dispatch, hostelId]);

  useEffect(() => {
    if (!Array.isArray(backendBuildings) || backendBuildings.length === 0) {
      setBuildings([]);
      setFloorsByBuilding({});
      return;
    }

    console.log("Processing buildings data:", backendBuildings);

    const uiBuildings = backendBuildings.map((b) => {
      const floorsLabels = Array.isArray(b.floors)
        ? b.floors.map((f) => `Floor ${f.floorNo}`)
        : Array.from({ length: b.floorCount || 0 }, (_, i) => `Floor ${i + 1}`);

      const uniqueRoomIds = new Set();
      const rooms = [];

      if (Array.isArray(b.floors)) {
        b.floors.forEach((f) => {
          if (Array.isArray(f.rooms)) {
            f.rooms.forEach((r) => {
              if (!uniqueRoomIds.has(r.id)) {
                uniqueRoomIds.add(r.id);

                const roomNumber = r.roomNo.toString();

                const beds = Array.isArray(r.beds) && r.beds.length > 0
                  ? r.beds.map((bd) => ({
                      id: bd.id,
                      bedNo: bd.bedNo,
                      status: bd.status || "VACANT",
                      price: bd.price || 0,
                      deposit: bd.deposit || 0,
                      student: bd.student || null,
                    }))
                  : [];

                rooms.push({
                  id: r.id,
                  roomNo: r.roomNo,
                  floorId: f.id,
                  floorNo: f.floorNo,
                  number: roomNumber,
                  type: r.type || "CLA",
                  sharing: r.sharing || 2,
                  beds, 
                });
              } else {
                console.warn(
                  `Duplicate room ID ${r.id} found in building ${b.id}`
                );
              }
            });
          }
        });
      }

      return {
        id: b.id,
        name: b.name || `Building ${b.id}`,
        activeTab: "Hostel Room",
        activeFloor: floorsLabels.length ? floorsLabels[0] : "Floor 1",
        tabs: ["Hostel Room", "Apartment", "Hostel"],
        floors: floorsLabels,
        rooms,
        currentPage: 0,
        roomsPerPage: 20,
        floorCount: b.floorCount,
        wardenName: b.wardenName,
        wardenEmail: b.wardenEmail,
        wardenContactNo: b.wardenContactNo,
        backendData: b,
        hostelName: b.hostelName || ""
      };
    });

    setBuildings(uiBuildings);
    
    if (backendBuildings.length > 0 && backendBuildings[0].hostelName) {
      setHostelName(backendBuildings[0].hostelName);
    }

    backendBuildings.forEach((b) => {
      dispatch(getFloorsByBuildingId(b.id))
        .unwrap()
        .then((floorsPayload) => {
          console.log(`Floors for building ${b.id}:`, floorsPayload);
          setFloorsByBuilding((prev) => ({
            ...prev,
            [b.id]: Array.isArray(floorsPayload) ? floorsPayload : [],
          }));

          if (Array.isArray(floorsPayload)) {
            floorsPayload.forEach((floor) => {
              if (floor.id && floor.id > 0) {
                fetchRoomsForFloor(floor.id, b.id, floor.floorNo);
              } else {
                console.warn(`Invalid floor ID for building ${b.id}:`, floor);
              }
            });
          }
        })
        .catch((err) => {
          console.error(`Error fetching floors for building ${b.id}:`, err);
          setFloorsByBuilding((prev) => ({ ...prev, [b.id]: [] }));
        });
    });
  }, [backendBuildings, dispatch]);

  const fetchRoomsForFloor = useCallback(
    async (floorId, buildingId, floorNo) => {
      if (!floorId || floorId <= 0) {
        console.log(`Skipping invalid floor ID: ${floorId}`);
        return;
      }

      try {
        console.log(`Fetching rooms for floor ${floorId} (Floor ${floorNo})`);
        const roomsPayload = await dispatch(
          getRoomsByFloorId(floorId)
        ).unwrap();

        console.log(`Rooms fetched for floor ${floorId}:`, roomsPayload);

        setRoomsByFloor((prev) => ({
          ...prev,
          [floorId]: Array.isArray(roomsPayload) ? roomsPayload : [],
        }));

        setBuildings((prev) => {
          const updated = [...prev];
          const buildingIndex = updated.findIndex((b) => b.id === buildingId);
          if (buildingIndex !== -1) {
            const uiRooms = (
              Array.isArray(roomsPayload) ? roomsPayload : []
            ).map((room) => {
              const roomNumber = room.roomNo.toString();

              // FIXED: Ensure beds array is empty for newly created rooms
              const beds = Array.isArray(room.beds) && room.beds.length > 0 
                ? room.beds.map((bd) => ({
                    id: bd.id,
                    bedNo: bd.bedNo,
                    status: bd.status || "VACANT",
                    price: bd.price || 0,
                    deposit: bd.deposit || 0,
                    student: bd.student || null,
                  }))
                : []; // Empty array if no beds

              return {
                id: room.id,
                roomNo: room.roomNo,
                floorId: floorId,
                floorNo: floorNo,
                number: roomNumber,
                type: room.type || "CLA",
                sharing: room.sharing || 2,
                beds, // This will be empty for new rooms
              };
            });

            const existingRooms = updated[buildingIndex].rooms || [];
            const otherFloorRooms = existingRooms.filter(
              (room) => room.floorNo !== floorNo
            );
            updated[buildingIndex] = {
              ...updated[buildingIndex],
              rooms: [...otherFloorRooms, ...uiRooms],
            };
          }
          return updated;
        });
      } catch (err) {
        console.log(`Floor ${floorId} has no rooms (404) - this is normal`+err);
        setRoomsByFloor((prev) => ({ ...prev, [floorId]: [] }));
      }
    },
    [dispatch]
  );

  const handleRefresh = () => {
    fetchAllData();
  };

  const openAddBuildingModal = () => {
    if (!hostelId) {
      alert("No hostel selected");
      return;
    }
    setBuildingForm({
      name: "",
      floorCount: "",
      wardenName: "",
      wardenEmail: "",
      wardenContactNo: "",
    });
    setShowAddBuildingModal(true);
  };

  const handleBackendAddBuilding = async () => {
    if (!hostelId) {
      alert("No hostel selected");
      return;
    }

    if (!buildingForm.name.trim()) {
      alert("Building name is required");
      return;
    }
    
    if (!buildingForm.floorCount || buildingForm.floorCount <= 0) {
      alert("Please enter a valid floor count");
      return;
    }

    const payload = {
      hostelId,
      buildingData: {
        name: buildingForm.name,
        floorCount: Number(buildingForm.floorCount),
        wardenName: buildingForm.wardenName || "",
        wardenEmail: buildingForm.wardenEmail || "",
        wardenContactNo: buildingForm.wardenContactNo || "",
      },
    };

    console.log("Adding building with payload:", payload);

    try {
      await dispatch(addBuildingByHostelId(payload)).unwrap();
      
      await fetchAllData();
      
      setShowAddBuildingModal(false);
      setBuildingForm({
        name: "",
        floorCount: "",
        wardenName: "",
        wardenEmail: "",
        wardenContactNo: "",
      });
      
      alert("Building added successfully!");
    } catch (err) {
      console.error("Add building failed:", err);
      alert("Failed to add building: " + (err.message || "Unknown error"));
    }
  };

  const openAddRoomModal = (buildingIndex) => {
    const floorId = getCurrentFloorId(buildingIndex);
    if (!floorId) {
      console.error("No floor selected");
      alert("Please select a floor first");
      return;
    }

    setActiveBuildingIndex(buildingIndex);
    setRoomModalForFloorId(floorId);
    setRoomForm({ roomNo: "", sharing: "2", type: "CLA" });
    setShowAddRoomModal(true);
  };

  const handleBackendAddRoom = async () => {
    if (!roomModalForFloorId) return;

    const floorId = roomModalForFloorId;
    const payload = {
      floorId,
      roomData: {
        roomNo: Number(roomForm.roomNo),
        sharing: Number(roomForm.sharing),
        type: roomForm.type,
      },
    };

    console.log("Adding room with payload:", payload);

    try {
      await dispatch(addRoomByFloorId(payload)).unwrap();

      const building = buildings[activeBuildingIndex];
      if (building) {
        await fetchRoomsForFloor(
          floorId,
          building.id,
          getCurrentFloorNumber(activeBuildingIndex)
        );
      }

      setShowAddRoomModal(false);
      setRoomModalForFloorId(null);
      setRoomForm({ roomNo: "", sharing: "2", type: "CLA" });

      alert("Room added successfully!");
    } catch (err) {
      console.error("Add room failed:", err);
      alert("Failed to add room: " + (err.message || "Unknown error"));
    }
  };

  const getCurrentFloorId = (buildingIndex) => {
    const building = buildings[buildingIndex];
    if (!building) return null;

    const floorNumber = getCurrentFloorNumber(buildingIndex);
    const floors = floorsByBuilding[building.id];

    if (Array.isArray(floors)) {
      const floor = floors.find((f) => f.floorNo === floorNumber);
      return floor ? floor.id : null;
    }
    return null;
  };

  const getCurrentFloorNumber = (buildingIndex) => {
    const building = buildings[buildingIndex];
    if (!building) return 1;
    return parseInt(building.activeFloor.replace("Floor ", "")) || 1;
  };

  const getCurrentRooms = (building, buildingIndex) => {
    const floorNumber = getCurrentFloorNumber(buildingIndex);
    const filteredRooms = building.rooms.filter(
      (room) => room.floorNo === floorNumber
    );

    const startIndex = building.currentPage * building.roomsPerPage;
    const endIndex = startIndex + building.roomsPerPage;

    return filteredRooms.slice(startIndex, endIndex);
  };

  const handleFloorChange = (buildingIndex, floor) => {
    const updated = [...buildings];
    updated[buildingIndex].activeFloor = floor;
    updated[buildingIndex].currentPage = 0;
    setBuildings(updated);
  };

  const handleTabChange = (buildingIndex, tab) => {
    const updated = [...buildings];
    updated[buildingIndex].activeTab = tab;
    setBuildings(updated);
  };

  const handleAddRoom = (buildingIndex) => {
    openAddRoomModal(buildingIndex);
  };

  const handleNextPage = (buildingIndex) => {
    const updated = [...buildings];
    const building = updated[buildingIndex];
    const floorNumber = getCurrentFloorNumber(buildingIndex);
    const filteredRooms = building.rooms.filter(
      (room) => room.floorNo === floorNumber
    );
    const totalPages =
      Math.ceil(filteredRooms.length / building.roomsPerPage) || 1;

    if (building.currentPage < totalPages - 1) {
      building.currentPage += 1;
      setBuildings(updated);
    }
  };

  const handlePrevPage = (buildingIndex) => {
    const updated = [...buildings];
    const building = updated[buildingIndex];

    if (building.currentPage > 0) {
      building.currentPage -= 1;
      setBuildings(updated);
    }
  };

  const handleRoomClick = (room, buildingIndex) => {
    setActiveBuildingIndex(buildingIndex);
    setSelectedRoom(room);
    setShowBedManagement(true);
  };

  const refreshRoomData = useCallback(async () => {
    if (!selectedRoom) return;

    try {
      const building = buildings[activeBuildingIndex];
      if (!building) return;

      const floorId = getCurrentFloorId(activeBuildingIndex);
      if (!floorId) return;

      await fetchRoomsForFloor(
        floorId,
        building.id,
        getCurrentFloorNumber(activeBuildingIndex)
      );
    } catch (error) {
      console.error("Error refreshing room data:", error);
    }
  }, [
    selectedRoom,
    buildings,
    activeBuildingIndex,
    fetchRoomsForFloor,
    getCurrentFloorId,
    getCurrentFloorNumber,
  ]);

  const getTotalRoomsForCurrentFloor = (buildingIndex) => {
    const building = buildings[buildingIndex];
    if (!building) return 0;

    const floorNumber = getCurrentFloorNumber(buildingIndex);
    const filteredRooms = building.rooms.filter(
      (room) => room.floorNo === floorNumber
    );

    return filteredRooms.length;
  };

  const handleDeleteBuilding = async (buildingId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this building? This will delete all floors and rooms inside."
      )
    ) {
      return;
    }

    try {
      await dispatch(deleteBuildingById(buildingId)).unwrap();
      fetchAllData();
      alert("Building deleted successfully!");
    } catch (err) {
      console.error("Delete building failed:", err);
      alert("Failed to delete building: " + (err.message || "Unknown error"));
    }
  };

  const openAddFloorModal = (buildingId) => {
    setFloorModalForBuildingId(buildingId);
    setFloorForm({ floorNo: "", roomCount: "" });
    setShowFloorModal(true);
  };

  const handleBackendAddFloor = async () => {
    if (!floorModalForBuildingId) return;

    const buildingId = floorModalForBuildingId;
    const payload = {
      buildingId,
      floorData: {
        floorNo: Number(floorForm.floorNo),
        roomCount: Number(floorForm.roomCount),
      },
    };

    try {
      await dispatch(addFloorByBuildingId(payload)).unwrap();

      const floorsPayload = await dispatch(
        getFloorsByBuildingId(buildingId)
      ).unwrap();

      setFloorsByBuilding((prev) => ({
        ...prev,
        [buildingId]: Array.isArray(floorsPayload) ? floorsPayload : [],
      }));

      fetchAllData();

      setShowFloorModal(false);
      setFloorModalForBuildingId(null);
      setFloorForm({ floorNo: "", roomCount: "" });

      alert("Floor added successfully!");
    } catch (err) {
      console.error("Add floor failed:", err);
      alert("Failed to add floor: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="building-management">
      <div className="wrap">
        <div className="page-header">
          <h1 className="display-6 ">{hostelName}</h1>
          <div className="header-buttons">
            <button
              className="btn-add-building"
              onClick={openAddBuildingModal}
              title="Add New Building"
            >
              <FaPlus size={16} />
              Add Building
            </button>
            <button
              className="btn-refresh"
              onClick={handleRefresh}
              disabled={isRefreshing || buildingsLoading}
              title="Refresh data"
            >
              <MdRefresh
                size={20}
                className={
                  isRefreshing ? "refresh-icon spinning" : "refresh-icon"
                }
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {buildingsLoading && (
          <div className="loading">Loading buildings...</div>
        )}
        {buildingsError && (
          <div className="error">Error: {String(buildingsError)}</div>
        )}
        {roomsError && (
          <div className="error">Room Error: {String(roomsError)}</div>
        )}

        {buildings.length === 0 && !buildingsLoading && (
          <div className="no-buildings-message">
            <p>No buildings found. Add a building to get started.</p>
          </div>
        )}

        {buildings.map((building, index) => (
          <BuildingSection
            key={building.id}
            building={building}
            buildingIndex={index}
            floorsByBuilding={floorsByBuilding}
            setBuildings={setBuildings}
            openAddFloorModal={openAddFloorModal}
            handleDeleteBuilding={handleDeleteBuilding}
            handleAddRoom={handleAddRoom}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            getCurrentRooms={(bld) => getCurrentRooms(bld, index)}
            handleRoomClick={handleRoomClick}
            handleTabChange={handleTabChange}
            handleFloorChange={handleFloorChange}
            roomsLoading={roomsLoading}
            totalRoomsForCurrentFloor={getTotalRoomsForCurrentFloor(index)}
          />
        ))}
      </div>

      <AddBuildingModal
        show={showAddBuildingModal}
        onClose={() => {
          setShowAddBuildingModal(false);
          setBuildingForm({
            name: "",
            floorCount: "",
            wardenName: "",
            wardenEmail: "",
            wardenContactNo: "",
          });
        }}
        onSubmit={handleBackendAddBuilding}
        formData={buildingForm}
        onFormChange={(e) =>
          setBuildingForm({ ...buildingForm, [e.target.name]: e.target.value })
        }
      />

      <AddRoomModal
        show={showAddRoomModal}
        onClose={() => {
          setShowAddRoomModal(false);
          setRoomModalForFloorId(null);
          setRoomForm({ roomNo: "", sharing: "2", type: "CLA" });
        }}
        onSubmit={handleBackendAddRoom}
        formData={roomForm}
        onFormChange={(e) =>
          setRoomForm({ ...roomForm, [e.target.name]: e.target.value })
        }
      />

      {selectedRoom && (
        <BedManagementModal
          show={showBedManagement}
          onClose={() => {
            setShowBedManagement(false);
            setSelectedRoom(null);
          }}
          room={selectedRoom}
          onUpdate={refreshRoomData}
        />
      )}

      <FloorAddModal
        show={showFloorModal}
        onClose={() => {
          setShowFloorModal(false);
          setFloorModalForBuildingId(null);
          setFloorForm({ floorNo: "", roomCount: "" });
        }}
        onSubmit={handleBackendAddFloor}
        formData={floorForm}
        onFormChange={(e) =>
          setFloorForm({ ...floorForm, [e.target.name]: e.target.value })
        }
      />
    </div>
  );
};

export default BuildingManagement;