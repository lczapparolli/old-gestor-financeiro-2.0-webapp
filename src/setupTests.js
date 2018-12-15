import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import fakeIndexedDB from 'fake-indexeddb';
import IDBKeyRange from 'fake-indexeddb/lib/FDBKeyRange';
import Dexie from 'dexie';

configure({ adapter: new Adapter() });

//Mocked indexedDb
Dexie.dependencies.indexedDB = fakeIndexedDB;
Dexie.dependencies.IDBKeyRange = IDBKeyRange;
