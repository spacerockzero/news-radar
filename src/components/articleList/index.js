import { h, Component } from 'preact';
import map from 'lodash.map';
import sortby from 'lodash.sortby';
import Article from '../article';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';

export default class ArticleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
			newArticles: []
		};
	}
	componentWillMount() {
		// queue feed update through firebase function
		const updateFeed = window.fetch(
			'https://us-central1-news-radar.cloudfunctions.net/newArticles'
		);
	}

	render(props, state) {
		const mergeNewArticles = e => {
			// user asked to see new articles. merge them to top of articles list
			console.log('mergeNewArticles!');
			state.articles.unshift(...state.newArticles);
			this.setState({ newArticles: [] });
			this.setState({ articles: state.articles });
		};
		// const updateButtonClass = state.articles.length > 0 ? {style.show} : {style.hide};
		const updateButton = (
			<Button className="mdc-button mdc-button--raised" onClick={mergeNewArticles}>
				Load {state.newArticles.length} new articles!
			</Button>
		);
		return (
			<articlelist className={style.articlelist}>
				{state.newArticles.length > 0 ? updateButton : null}
				{map(state.articles, (article, key) => <Article key={key} {...article} />)}
			</articlelist>
		);
	}
}
