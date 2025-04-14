
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type TransactionType = "income" | "expense";

const DataEntryPage = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<TransactionType>("expense");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle form submission here - this is just a placeholder
    toast.success("Transaction added successfully!");
    
    // Reset form
    setAmount("");
    setDescription("");
    setCategory("");
  };

  const categories = type === "income" 
    ? ["Salary", "Freelance", "Investment", "Gift", "Other"] 
    : ["Food", "Transportation", "Housing", "Entertainment", "Utilities", "Healthcare", "Other"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Entry</h1>
        <p className="text-muted-foreground">
          Record your financial transactions here.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>New Transaction</CardTitle>
            <CardDescription>Record a new income or expense</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={type === "expense" ? "default" : "outline"}
                    className={type === "expense" ? "bg-danger-500 hover:bg-danger-600" : ""}
                    onClick={() => setType("expense")}
                  >
                    Expense
                  </Button>
                  <Button
                    type="button"
                    variant={type === "income" ? "default" : "outline"}
                    className={type === "income" ? "bg-success-500 hover:bg-success-600" : ""}
                    onClick={() => setType("income")}
                  >
                    Income
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter transaction description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700">
                Add Transaction
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>Your most recent transactions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-center p-8 text-muted-foreground">
                No recent entries to display
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Consistently tracking your expenses helps identify spending patterns and areas for saving.
              </p>
              <p className="text-sm">
                Categorize transactions accurately for better financial insights.
              </p>
              <p className="text-sm">
                Review your entries regularly to ensure accuracy in your financial records.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataEntryPage;
