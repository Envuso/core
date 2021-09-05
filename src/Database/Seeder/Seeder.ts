import {SeederContract} from "../../Contracts/Database/Seeder/SeederContract";

export abstract class Seeder implements SeederContract {

	public abstract seed(): Promise<any>;

}
