import { Inngest } from "inngest";
import connectDB from "../config/db";
import User from "../models/User";

// إنشاء عميل Inngest
export const inngest = new Inngest({ id: "TahaEcommerce-next" });

// دالة Inngest لتخزين بيانات المستخدم في قاعدة البيانات
export const syncUserCreation = inngest.createFunction(
  {
    id: 'sync-user-from-clerk', // معرف الدالة
  },
  {
    event: 'clerk/user.created', // الحدث الذي سيتم الاستماع له من Clerk
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id, // ممكن تستخدمه كمفتاح أساسي إذا تحب
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();
    await User.create(userData);
  }
);

// دالة Inngest لتحديث بيانات المستخدم في قاعدة البيانات
export const syncUserUpdate = inngest.createFunction(
    {
      id: 'update-user-from-clerk', // معرف الدالة في Inngest
    },
    {
      event: 'clerk/user.updated', // الحدث الذي يتم مراقبته
    },
    async ({ event }) => {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
  
      const UserData = {
        email: email_addresses[0]?.email_address || "",
        name: first_name + '' + last_name,
        imageUrl: image_url,
      };
  
      await connectDB();
      await User.findByIdAndUpdate(id, updatedUserData);
    }
  );
  
  // دالة Inngest لتحديث بيانات المستخدم في قاعدة البيانات
export const syncUserdeletion = inngest.createFunction(
    {
      id: 'delete-user-with-clerk', // معرف الدالة في Inngest
    },
    {
      event: 'clerk/user.deleted', // الحدث الذي يتم مراقبته
    },
    async ({ event }) => {
      const { id } = event.data;
  
      await connectDB();
      await User.findByIdAndDelete(id,);
    }
  );