import * as mongodb from "mongodb";
import { Service } from "./service";

export interface Job {
    jobTitle: string;
    customer: mongodb.ObjectId; // customer id stored in client collection
    totalSquareFootage: number;
    serviceType: Service;
    totalprice: number;
    sections: Section[]; // Add sections to Job
    datesOfService: DateOfService[]; // Add dates of service to Job
    contractors?: mongodb.ObjectId[]; // userid of contractors assigned to the job
    numberofcontractors: number;
    _id: mongodb.ObjectId;
}

export interface Section {
    jobId: mongodb.ObjectId;
    sectionName: string;
    measurements: Measurement[]; // List of measurements for the section
    _id: mongodb.ObjectId;
}

export interface Measurement {
    length: number;
    width: number;
}

export interface DateOfService {
    date: Date;
    startTime: string; // Format: 'HH:mm'
    endTime: string; // Format: 'HH:mm'
    totalTime: string; // Format: 'HH:mm'
}
