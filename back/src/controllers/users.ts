import { Request, Response } from "express";
import * as UserModel from "../models/users";
import { CreateUserDTO } from "../types";

/**
 * GET /api/admin/users
 * Admin only. Lists all users (no password hashes).
 */
export function getAll(req: Request, res: Response) {
  const users = UserModel.getAllUsers();
  res.json({ data: users });
}

/**
 * POST /api/admin/users
 * Admin only. Creates a new user (admin or staff).
 *
 * Body: { username: string, password: string, role: "admin" | "staff" }
 */
export function create(req: Request, res: Response) {
  const { username, password, role } = req.body as CreateUserDTO;

  // Validate required fields
  if (!username || !password || !role) {
    res
      .status(400)
      .json({ error: "username, password, and role are required" });
    return;
  }

  if (!["admin", "staff"].includes(role)) {
    res.status(400).json({ error: "role must be 'admin' or 'staff'" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  try {
    const user = UserModel.createUser({ username, password, role });
    res.status(201).json({ data: user });
  } catch (err: any) {
    if (err.message === "USERNAME_TAKEN") {
      res.status(409).json({ error: "That username is already taken" });
      return;
    }
    throw err;
  }
}

/**
 * DELETE /api/admin/users/:id
 * Admin only.
 *
 * Two safety checks:
 * 1. Can't delete yourself (would be confusing at minimum)
 * 2. Can't delete the last admin (would permanently lock everyone out)
 */
export function remove(req: Request, res: Response) {
  const targetId = req.params.id as string;
  const requesterId = req.user!.id;

  // Prevent self-deletion
  if (targetId === requesterId) {
    res.status(400).json({ error: "You cannot delete your own account" });
    return;
  }

  // Prevent deleting the last admin
  const targetUser = UserModel.findById(targetId);
  if (targetUser?.role === "admin" && UserModel.countAdmins() <= 1) {
    res.status(400).json({
      error:
        "Cannot delete the last admin account — create another admin first",
    });
    return;
  }

  const deleted = UserModel.deleteUser(targetId);
  if (!deleted) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(204).send();
}
