import { User, type UserDocument } from "../models/user.model.js";

class UserRepository {
  async create(data: {
    username: string;
    email: string;
    fullName: string;
    password: string;
  }): Promise<UserDocument> {
    return await User.create(data);
  }

  async findById(id: string): Promise<UserDocument | null> {
    return await User.findById(id);
  }

  async findByIdSafe(id: string): Promise<UserDocument | null> {
    const user = await User.findById(id).select("-password -refreshToken");
    return user as UserDocument | null;
  }

  async findByUsernameOrEmail(
    username?: string,
    email?: string
  ): Promise<UserDocument | null> {
    return await User.findOne({
      $or: [{ username }, { email }],
    });
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $set: { refreshToken },
    });
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });
  }
}

export const userRepository = new UserRepository();
