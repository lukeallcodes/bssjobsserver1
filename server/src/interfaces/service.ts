import * as mongodb from "mongodb";

export interface SeverityLevel {
    level: string;
    rate: number;
}

export interface Service {
    servicename: string;
    severities: SeverityLevel[];
    _id: mongodb.ObjectId;
}
