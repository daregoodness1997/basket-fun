import { Suspense } from "react";
import CreateBasketDialog from "@/components/create-baskets-dialog";
import BasketsTable from "@/components/baskets-table";

export default function Home() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8">Basket Manager</h1>
            <div className="mb-4">
                <CreateBasketDialog />
            </div>
            <Suspense fallback={<div>Loading baskets...</div>}>
                <BasketsTable />
            </Suspense>
        </div>
    );
}
