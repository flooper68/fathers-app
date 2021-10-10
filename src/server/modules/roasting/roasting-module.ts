import { finishRoastingUseCase } from './use-cases/finish-roasting';
import { createRoastingUseCase } from './use-cases/create-roasting';
import { reportRealYieldUseCase } from './use-cases/report-real-yield';
import { selectOrdersRoastingUseCase } from './use-cases/select-orders-roasting';
import { getRoastingProductUseCase } from './use-cases/get-roasting-product';
import { updateRoastedCoffeeUseCase } from './use-cases/update-roasted-coffee';
import { createRoastedCoffeeUseCase } from './use-cases/create-roasted-coffee';
import { startRoastingUseCase } from './use-cases/start-roasting';
import { getAllGreenCoffeesUseCase } from './use-cases/get-all-green-coffees';
import { getGreenCoffeeUseCase } from './use-cases/get-green-coffee';
import { createGreenCoffeeUseCase } from './use-cases/create-green-coffee';
import { RoastingContext, RoastingModule } from './roasting-contracts';
import { assignProductToRoastedCoffeeUseCase } from './use-cases/assign-product-to-roasted-coffee';
import { updateGreenCoffeeUseCase } from './use-cases/update-green-coffee';
import { getRoastedCoffeeUseCase } from './use-cases/get-roasted-coffee';
import { getAllRoastedCoffeesUseCase } from './use-cases/get-all-roasted-coffees';
import { getAllRoastingsUseCase } from './use-cases/get-all-roastings';
import { getRoastingByOrderUseCase } from './use-cases/get-roasting';
import { finishBatchUseCase } from './use-cases/finish-batch';

export const buildRoastingModule = (
  context: RoastingContext
): RoastingModule => {
  return {
    assignProductToRoastedCoffee: (props) =>
      assignProductToRoastedCoffeeUseCase(props, context),
    createGreenCoffee: (props) => createGreenCoffeeUseCase(props, context),
    updateGreenCoffee: (props) => updateGreenCoffeeUseCase(props, context),
    getGreenCoffee: (props) => getGreenCoffeeUseCase(props, context),
    getRoastedCoffee: (props) => getRoastedCoffeeUseCase(props, context),
    getAllGreenCoffees: () => getAllGreenCoffeesUseCase(context),
    getAllRoastedCoffees: () => getAllRoastedCoffeesUseCase(context),
    startRoasting: () => startRoastingUseCase(context),
    createRoastedCoffee: (props) => createRoastedCoffeeUseCase(props, context),
    updateRoastedCoffee: (props) => updateRoastedCoffeeUseCase(props, context),
    getRoastingProduct: (props) => getRoastingProductUseCase(props, context),
    getAllRoastings: () => getAllRoastingsUseCase(context),
    selectOrdersRoasting: (props) =>
      selectOrdersRoastingUseCase(props, context),
    getRoastingByOrder: (props) => getRoastingByOrderUseCase(props, context),
    reportRealYield: (props) => reportRealYieldUseCase(props, context),
    createRoasting: (props) => createRoastingUseCase(props, context),
    finishRoasting: () => finishRoastingUseCase(context),
    finishBatch: (props) => finishBatchUseCase(props, context),
  };
};
