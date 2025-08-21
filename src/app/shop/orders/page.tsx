import { getOrders } from "@/actions/orders";
import { getStudent } from "@/actions/students";
import { Card } from "@/components/ui/card";
import { Order, OrderStatus } from "@prisma/client";
import { Coins } from "lucide-react";

function getStatusColor(status: OrderStatus) {
    switch (status) {
      case "COMPLETED":
        return "bg-accent"
      case "PENDING":
        return "bg-yellow-500"
      case "CANCELLED":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }
  
const OrderStatusMap: {[key in OrderStatus]: string} = {
    CANCELLED: 'Отменен',
    COMPLETED: 'Завершен',
    PENDING: 'В работе'
}

export default async function Page() {
    const student = await getStudent()
    const orders = await getOrders({ where: { studentId: student?.id } })
    
    console.log(orders)
    return <div className="space-y-4">
    {orders.map((order) => (
      <div key={order.id} className="rounded-xl border p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`}></div>
              <span className="text-sm font-medium text-foreground">{OrderStatusMap[order.status]}</span>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">{order.createdAt.toLocaleDateString('ru-RU')}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-foreground">{order.product.name}</span>
              </div>
              <span className="text-foreground flex items-center gap-2">
                <Coins size={16} color="rgb(131, 58, 224)" />
                <span className="text-lg font-bold">{order.product.price.toFixed(2)}</span>
                </span>
            </div>
          
        </div>

       
      </div>
    ))}
  </div>
}