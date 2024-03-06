# Hospital Management App

A web application for Hospital Management.

### How To Run?

- Clone the repo
- Run 'npm i' command to install all dependancies
- add 'MONGO_URL' and 'PORT' variables in .env file
- Run 'npm start' command

## List of APIs

### 1. Rooms Overview (availability)

- Endpoint --> http://localhost:8080/hospital/getRoomsOverview
- Request Type --> GET
- Response -->

```
[
    {
        "_id": "65e8011e10faac8f732933b2",
        "typeOfRoom": "Oxygen Room",
        "numberOfAvailableRooms": 49
    },
    {
        "_id": "65e803ca10faac8f732933b3",
        "typeOfRoom": "ICU Room",
        "numberOfAvailableRooms": 19
    },
    {
        "_id": "65e803f010faac8f732933b4",
        "typeOfRoom": "Normal Room",
        "numberOfAvailableRooms": 49
    }
]
```

### 2. Beds Overview (availability)

- Endpoint --> http://localhost:8080/hospital/getBedsOverview
- Request Type --> GET
- Response -->

```
[
    {
        "_id": "65e80ad910faac8f732933b5",
        "typeOfBed": "Flat Bed",
        "numberOfAvailableBeds": 79
    },
    {
        "_id": "65e80b2e10faac8f732933b6",
        "typeOfBed": "Recliner Bed",
        "numberOfAvailableBeds": 98
    }
]
```

### 3. Equipments Overview (availability)

- Endpoint --> http://localhost:8080/hospital/getEquipmentsOverview
- Request Type --> GET
- Response -->

```
[
    {
        "_id": "65e80c0e10faac8f732933b7",
        "equipmentName": "Ventilators",
        "numberOfAvailableEquipments": 15
    },
    {
        "_id": "65e80c9a10faac8f732933b8",
        "equipmentName": "Oxygen Cylinders",
        "numberOfAvailableEquipments": 107
    },
    {
        "_id": "65e80cec10faac8f732933b9",
        "equipmentName": "Normal Masks",
        "numberOfAvailableEquipments": 198
    },
    {
        "_id": "65e80d1610faac8f732933bb",
        "equipmentName": "Non rebreather masks",
        "numberOfAvailableEquipments": 118
    }
]
```

### 4. Admit Patiant

- Endpoint --> http://localhost:8080/hospital/admitPatiant
- Request Type --> POST
- Request Body -->

```
{
    "patientName": "Johny Depp 10",
    "roomType":"ICU Room"
}
```

- Response -->

```
ICU Room (with 1 ventilator + 1 recliner bed + 1 oxygen cylinder) reserved.
```

### 5. Get All Patients List

- Endpoint --> http://localhost:8080/hospital/getPatientsList
- Request Type --> GET
- Response -->

```
[
    {
        "_id": "65e813a606bc8ec1bdf17425",
        "patientName": "John Snow",
        "roomType": "ICU Room",
        "__v": 0
    },
    {
        "_id": "65e83bb803bccb41c0837a23",
        "patientName": "Bhide Bhai",
        "roomType": "Oxygen Room",
        "__v": 0
    },
    {
        "_id": "65e84555c0648527bd3eca40",
        "patientName": "Johny Depp",
        "roomType": "Normal Room",
        "__v": 0
    },
    {
        "_id": "65e85b5f1a6f80b5176ffe4d",
        "patientName": "Johny Depp 10",
        "roomType": "ICU Room",
        "__v": 0
    }
]
```

### 6. Discharge Patiant

- Endpoint --> http://localhost:8080/hospital/dischargePetiant/patientId
- Request Type --> DELETE
- Response -->

```
Discharge Procedure Is Completed Successfully
```
