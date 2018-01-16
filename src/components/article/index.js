import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
// import style from './style';

export default class Article extends Component {
	// constructor(props) {
	// 	super(props);
	// 	// this.markAsRead = this.markAsRead.bind(this);
	// }
	// markAsRead(e) {
	// 	e.preventDefault();
	// 	console.log('id1');
	// 	this.setState({ read: e.target.value });
	// }
	render(state, props) {
		return (
			<article className="article">
				<Card>
					<Card.Primary>
						<Card.Subtitle>
							<a href={state.link} name={state.id} onClick={this.props.markAsRead}>
								{state.title}
							</a>
						</Card.Subtitle>
						<Card.Title>from {state.feedsrc}</Card.Title>
					</Card.Primary>
					<Card.SupportingText>{new Date(state.createdOn).toDateString()}</Card.SupportingText>
					{/* <Card.SupportingText>
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
						laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
						architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
						sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
						voluptatem sequi nesciunt.
					</Card.SupportingText> */}
					{/* <Card.Actions>
						<Card.Action>OKAY</Card.Action>
					</Card.Actions> */}
				</Card>
			</article>
		);
	}
}
