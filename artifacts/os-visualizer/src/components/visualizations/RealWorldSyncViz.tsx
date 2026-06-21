import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Plane, ShoppingCart, Database, Train, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ScenarioId = 'atm' | 'airline' | 'cart' | 'db' | 'train';

const SCENARIOS = [
  {
    id: 'atm',
    title: 'ATM Withdrawal',
    icon: Landmark,
    desc: 'Joint account, two simultaneous withdrawals of ₹700 from ₹1000 balance.',
    unsyncedResult: 'Balance = -₹400 (Overdraft)',
    syncedResult: 'Second withdrawal blocked (Insufficient Funds)',
  },
  {
    id: 'airline',
    title: 'Airline Booking',
    icon: Plane,
    desc: '1 seat left. Two users try to book it at the exact same millisecond.',
    unsyncedResult: 'Seat double-booked. Customer angry.',
    syncedResult: 'One succeeds, other gets "Seat Unavailable".',
  },
  {
    id: 'cart',
    title: 'Shopping Cart',
    icon: ShoppingCart,
    desc: 'Flash sale: 1 item left in inventory. Two clicks on "Buy Now".',
    unsyncedResult: 'Inventory becomes -1. Oversold.',
    syncedResult: 'Inventory reaches 0 safely.',
  },
  {
    id: 'db',
    title: 'Database Update',
    icon: Database,
    desc: 'Two admins updating the same record concurrently.',
    unsyncedResult: 'Lost Update (Last-write-wins silently overwrites).',
    syncedResult: 'ACID transaction ensures serialization.',
  },
  {
    id: 'train',
    title: 'Railway Reservation',
    icon: Train,
    desc: 'Classic IRCTC scenario. Millions hitting the server at 10 AM.',
    unsyncedResult: 'Chaos, double bookings, inconsistent state.',
    syncedResult: 'Orderly queue, strictly serialized bookings.',
  }
];

export function RealWorldSyncViz() {
  const [activeId, setActiveId] = useState<ScenarioId | null>(null);
  const [withSync, setWithSync] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">Real-World Consequences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6 p-4 bg-muted rounded-lg border w-fit mx-auto">
          <Label htmlFor="sync-mode" className={`font-mono ${!withSync ? 'text-destructive font-bold' : ''}`}>Without Sync</Label>
          <Switch id="sync-mode" checked={withSync} onCheckedChange={setWithSync} />
          <Label htmlFor="sync-mode" className={`font-mono ${withSync ? 'text-green-500 font-bold' : ''}`}>With Sync</Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCENARIOS.map((scenario) => {
            const Icon = scenario.icon;
            const isActive = activeId === scenario.id;

            return (
              <motion.div 
                key={scenario.id}
                layout
                onClick={() => setActiveId(isActive ? null : scenario.id as ScenarioId)}
                className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${isActive ? 'ring-2 ring-primary border-primary shadow-lg md:col-span-2 lg:col-span-3' : 'hover:border-primary/50 bg-card'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${withSync ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{scenario.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{scenario.desc}</p>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <div className={`p-4 rounded-lg flex items-start gap-3 ${withSync ? 'bg-green-500/5 border border-green-500/20' : 'bg-destructive/5 border border-destructive/20'}`}>
                            {withSync ? <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5" /> : <ShieldAlert className="w-5 h-5 text-destructive mt-0.5" />}
                            <div>
                              <div className="font-bold text-sm mb-1">{withSync ? 'Synchronized Result' : 'Race Condition Result'}</div>
                              <div className="font-mono text-sm">{withSync ? scenario.syncedResult : scenario.unsyncedResult}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}