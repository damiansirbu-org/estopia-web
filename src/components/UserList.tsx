import EntityList from './generic/EntityList';
import { userEntityConfig } from '../config/entities/userEntity';

export default function UserList() {
    return <EntityList config={userEntityConfig} />;
}