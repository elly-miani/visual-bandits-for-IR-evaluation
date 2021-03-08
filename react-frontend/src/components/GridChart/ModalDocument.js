import { Modal } from 'rsuite';


export default function ModalDocument(props) {

	const getRelevancy = (relevancy) => {
		switch (relevancy) {
			case 0:
				return "Nonrelevant";
			case 1:
				return "Relevant";
			case 2:
				return "Relevancy not available";
			default:
				break;
		}
	}

	const getRetrieved = (retrieved, retrievedFrom) => {
		switch (retrieved) {
			case 0:
				return "Not retrieved";
			case 1:
				return "Retrieved from this run";
			case 2:
				return (<span>Retrieved from run <strong>{retrievedFrom}</strong></span>);
			default:
				break;
		}
	}

	return (
		<Modal 
			size="xs"
			show={props.modal.show} 
			onHide={() => { props.setModal(prevState => { return {...prevState, show: false} }); }}
		>

			<Modal.Body>
				<div id="modal-document">
					<h5>
						{props.modal.document}
					</h5>
					<hr />
					<p>
						<strong>{getRelevancy(props.modal.relevancy)}</strong>
					</p>
					<p>
						{getRetrieved(props.modal.retrieved, props.modal.retrievedFrom)}
					</p>
					<hr/>
					<p>
						Topic: <strong>{props.modal.topic}</strong>
					</p>
					<p>
						Run: <strong>{props.modal.run}</strong> 
					</p>
					<p>
						Score: <strong>{props.modal.score}</strong>
					</p>
					
				</div>
			</Modal.Body>

			<Modal.Footer>

			</Modal.Footer>

		</Modal>
	);

}
