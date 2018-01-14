import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
// import style from './style';

export default class Article extends Component {
	render(state, props) {
		return (
			<article className="article">
				<Card>
					<Card.Primary>
						<Card.Title>{state.feedsrc}</Card.Title>
						<Card.Subtitle>
							<a href={state.link}>{state.title}</a>
						</Card.Subtitle>
					</Card.Primary>
					<Card.SupportingText>
						Created on: {state.createdOn.toDateString()}, {state.createdOn.toTimeString()}
					</Card.SupportingText>
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
