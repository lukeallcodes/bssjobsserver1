import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { Job } from "../interfaces/job";

export const jobRouter = express.Router();
jobRouter.use(express.json());

// GET all jobs
jobRouter.get("/", async (_req, res) => {
    try {
        const jobs = await collections.jobs?.find({}).toArray();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json(error instanceof Error ? error.message : "Unknown error");
    }
});

// GET a single job by ID
jobRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const job = await collections.jobs?.findOne({ _id: new ObjectId(id) });
        if (job) {
            res.status(200).json(job);
        } else {
            res.status(404).json(`Failed to find a job: ID ${id}`);
        }
    } catch (error) {
        res.status(500).json(error instanceof Error ? error.message : "Unknown error");
    }
});

// POST a new job
jobRouter.post("/", async (req, res) => {
    try {
        const job: Job = req.body;
        job._id = new ObjectId(); // Ensure _id is generated on the backend
        const result = await collections.jobs?.insertOne(job);
        if (result?.acknowledged) {
            res.status(201).json(job); // Return the created job
        } else {
            res.status(500).json({ message: "Failed to create a new job." });
        }
    } catch (error) {
        res.status(400).json(error instanceof Error ? { message: error.message } : { message: "Unknown error" });
    }
});

// PUT to update an existing job
jobRouter.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const job: Job = req.body;
        const query = { _id: new ObjectId(id) };

        // Create a new object excluding the _id field
        const { _id, ...jobWithoutId } = job;

        const result = await collections.jobs?.updateOne(query, { $set: jobWithoutId });
        if (result?.matchedCount) {
            res.status(200).json(`Updated a job: ID ${id}.`);
        } else {
            res.status(404).json(`Failed to find a job: ID ${id}`);
        }
    } catch (error) {
        res.status(400).json(error instanceof Error ? error.message : "Unknown error");
    }
});

// DELETE a job
jobRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections.jobs?.deleteOne(query);
        if (result?.deletedCount) {
            res.status(202).json(`Removed a job: ID ${id}`);
        } else {
            res.status(404).json(`Failed to find a job: ID ${id}`);
        }
    } catch (error) {
        res.status(400).json(error instanceof Error ? error.message : "Unknown error");
    }
});

// POST to add multiple recurring jobs
jobRouter.post("/recurring", async (req, res) => {
    try {
        const jobs: Job[] = req.body;
        const clientJobsCount = await collections.jobs?.countDocuments({ customer: jobs[0].customer });

        if (clientJobsCount && clientJobsCount + jobs.length > 50) {
            res.status(400).json({ message: "Exceeds maximum number of jobs per client." });
            return;
        }

        const result = await collections.jobs?.insertMany(jobs);
        if (result?.acknowledged) {
            res.status(201).json(jobs); // Return the created jobs
        } else {
            res.status(500).json({ message: "Failed to create new jobs." });
        }
    } catch (error) {
        res.status(400).json(error instanceof Error ? { message: error.message } : { message: "Unknown error" });
    }
});

