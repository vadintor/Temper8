// 0a1f294a-abe8-4da5-98aa-149de8e76976
// 55554474-e09f-423b-aedf-9dc249e79dd9
// deeb26b8-b4b0-4884-a1e1-b13c0c957805
// 00e5394a-2d99-4c2c-9c44-d752b618fc9b
// cdd1fc10-6d5e-4254-8886-4d4130897b55
// 8aa48c24-9d5d-4a92-847a-f866d54f4a9e
// 6db7fe5f-7add-4d88-9d54-99dc2420275d
// a449e701-371a-48b4-a8a5-e8105127c123
// 09a52499-dbb2-49be-a308-d1a25d92dc67
// 64bebe3d-7dcd-43c6-80a8-b2949a3b97ed
const BASE_UUID = '55554474-e09f-423b-aedf-9dc249e79dd9';

export enum UUID_Designator {
        PrimaryService = '0001',
        DeviceInfo = '0002',
        CurrentWiFi = '0003',
        AvailableWiFi = '0004',
    }
export function getUuid(designator: UUID_Designator) {
    return BASE_UUID.replace('4474', designator);
}
