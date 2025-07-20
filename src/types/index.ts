/**
 * User interface
 * Represents a user in the application
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's email address */
  email: string;
  /** User's full name */
  fullName: string;
  /** Optional URL to user's avatar image */
  avatarUrl?: string;
  /** Optional date of birth */
  dateOfBirth?: string;
  /** Optional user biography */
  bio?: string;
  /** Optional user location */
  location?: string;
  /** Optional phone number */
  phoneNumber?: string;
}

/**
 * Fundraiser interface
 * Represents a fundraising campaign
 */
export interface Fundraiser {
  /** Unique identifier for the fundraiser */
  id: string;
  /** Fundraiser title */
  title: string;
  /** Detailed description of the fundraiser */
  description: string;
  /** Target amount to raise */
  goalAmount: number;
  /** Current amount raised */
  currentAmount: number;
  /** Category of the fundraiser */
  category: string;
  /** URL to fundraiser's main image */
  imageUrl: string;
  /** ID of user who created the fundraiser */
  userId: string;
  /** Timestamp when fundraiser was created */
  createdAt: string;
  /** Deadline for the fundraiser */
  endDate: string;
  /** UPI ID for direct payments */
  upiId?: string;
}

/**
 * Donation interface
 * Represents a donation to a fundraiser
 */
export interface Donation {
  /** Unique identifier for the donation */
  id: string;
  /** Amount donated */
  amount: number;
  /** ID of the fundraiser receiving the donation */
  fundraiserId: string;
  /** ID of user making the donation */
  userId: string;
  /** Timestamp when donation was made */
  createdAt: string;
  /** Optional message from donor */
  message?: string;
}