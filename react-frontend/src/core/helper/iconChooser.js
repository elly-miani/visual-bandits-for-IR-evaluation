import { Icon } from 'rsuite';

import './iconChooser.css';

export default function iconChooser(isLoading, defaultIcon) {
	if (!isLoading) {
		return <Icon icon={defaultIcon} />;
	}
	else
		return <Icon icon="spinner" className="loader-icon" />;
}