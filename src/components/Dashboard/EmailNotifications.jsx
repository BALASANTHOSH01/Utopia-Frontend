import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const EmailNotifications = () => {
  const email = JSON.parse(localStorage.getItem("user"))?.user?.email;

  const handleUnsubscribe = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/newsletter/unsubscribe",
        { email }
      );
      toast.success("Unsubscribed successfully");
    } catch (err) {
      if (err.response.data.message === "Active subscription not found") {
        toast.error("You are not subscribed to email notifications");
        return;
      }
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="popp">
      <h1 className="text-xl font-bold">Email Notifications</h1>
      <label for="email">Email </label>
      <input
        type="email"
        id="email"
        value={email}
        disabled
        className="w-full bg-[#F5F5F5] p-2 rounded-[10px] mt-2"
      />

      <p className="mt-2">
        You are currently subscribed to email notifications. If you would like
        to unsubscribe, click the button below.
      </p>
      <button
        onClick={handleUnsubscribe}
        className="btn mt-5 bg-[#70B4E8] text-white popp p-2 w-full rounded-[10px]"
      >
        Unsubscribe
      </button>
    </div>
  );
};

export default EmailNotifications;
