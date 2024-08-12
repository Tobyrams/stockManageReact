import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

// Hook for managing stock subscriptions and fetching stock data. From the Dashboard Page \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export function useStockSubscription() {
  // State to store all stock items and low stock items
  const [stockItems, setStockItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    // Fetch initial data
    fetchStockItems_DashPG();
    fetchLowStockItems_DashPG();

    // Set up real-time subscription for stock changes
    const stockSubscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stocks" },
        handleStockChange
      )
      .subscribe();

    // Cleanup function to remove the subscription when the component unmounts
    return () => {
      supabase.removeChannel(stockSubscription);
    };
  }, []);

  // Handler for stock changes received from the subscription
  const handleStockChange = (payload) => {
    console.log("Change received!", payload);
    // Refetch data when a change occurs
    fetchStockItems_DashPG();
    fetchLowStockItems_DashPG();
  };

  // Function to fetch all stock items
  async function fetchStockItems_DashPG() {
    try {
      const { data, error } = await supabase
        .from("stocks")
        .select("name, expiry")
        .order("expiry", { ascending: true });

      if (error) throw error;
      setStockItems(data);
    } catch (error) {
      toast.error("Failed to fetch stock items");
      console.error("Error fetching stock items:", error);
    }
  }

  // Function to fetch low stock items (quantity <= 10)
  async function fetchLowStockItems_DashPG() {
    try {
      const { data, error } = await supabase
        .from("stocks")
        .select("name, quantity")
        .lte("quantity", 10)
        .order("quantity", { ascending: true });

      if (error) throw error;
      setLowStockItems(data);
    } catch (error) {
      toast.error("Failed to fetch low stock items");
      console.error("Error fetching low stock items:", error);
    }
  }

  return { stockItems, lowStockItems };
}

// Hook for managing stock subscriptions and fetching stock data. From the Stock Page \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export function useStockSubscription_StockPG() {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial stock data
    fetchStocks();

    // Set up real-time subscription for stock changes
    const subscription = supabase
      .channel("stocks_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stocks" },
        handleStocksChange
      )
      .subscribe();

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handler for real-time stock changes
  const handleStocksChange = (payload) => {
    if (payload.eventType === "INSERT") {
      // Add new stock to the list
      setStocks((prevStocks) => [...prevStocks, payload.new]);
    } else if (payload.eventType === "UPDATE") {
      // Update existing stock in the list
      setStocks((prevStocks) =>
        prevStocks.map((stock) =>
          stock.id === payload.new.id ? payload.new : stock
        )
      );
    } else if (payload.eventType === "DELETE") {
      // Remove deleted stock from the list
      setStocks((prevStocks) =>
        prevStocks.filter((stock) => stock.id !== payload.old.id)
      );
    }
  };

  // Function to fetch all stocks
  const fetchStocks = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error fetching stocks", {
        icon: "🚨",
      });
    } else {
      setStocks(data);
    }
    setIsLoading(false);
  };

  return { stocks, isLoading };
}
