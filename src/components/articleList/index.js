import { h, Component } from 'preact';
import map from 'lodash.map';
import sortby from 'lodash.sortby';
import Article from '../article';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import differenceBy from 'lodash-es/differenceBy';
import uniq from 'lodash-es/uniq';

// prod
const NEW_ARTICLES_URL = 'https://us-central1-news-radar.cloudfunctions.net/newArticles';
// dev
// const NEW_ARTICLES_URL = 'http://localhost:5000/news-radar/us-central1/newArticles';

function getLocalArticles() {
	let localArticles;
	try {
		localArticles = JSON.parse(window.localStorage.getItem('articles'));
	}
	catch (err) {
		console.error(err);
	}
	console.log('localArticles', localArticles);
	return localArticles || [];
}

function setLocalArticles(articleArr) {
	console.log('articleArr', articleArr);
	if (articleArr && articleArr.length > 0) {
		window.localStorage.setItem('articles', JSON.stringify(articleArr));
		console.log('articles saved locally');
	}
}
function setPrefs(prefs) {
	if (prefs) {
		window.localStorage.setItem('preferences', JSON.stringify(prefs));
		console.log('prefs saved locally');
	}
}

export default class ArticleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [],
			newArticles: [],
			preferences: { topics: [], read: [] }
		};
		this.markAsRead = this.markAsRead.bind(this);
	}
	getPrefs() {
		let prefs = { topics: ['technology'] };
		try {
			prefs = JSON.parse(window.localStorage.getItem('preferences'));
		}
		catch (err) {
			console.error(err);
		}
		console.log('prefs', prefs);
		return prefs || this.state.preferences;
	}
	markAsRead(e) {
		console.log('e', e);
		// e.preventDefault();
		e.stopPropagation();
		const id = e.target.name;
		if (id) {
			const prefs = this.state.preferences;
			const read = prefs.read || [];
			read.push(id);
			const uniqRead = uniq(read);
			prefs.read = uniqRead;
			const articles = this.state.articles;
			const filtered = articles.filter(art => !uniqRead.includes(art.id));
			// this.setState({ articles: filtered });
			setLocalArticles(filtered);
			this.setState({ preferences: prefs });
			setPrefs(prefs);
			console.log(`id ${id} marked as read`);
		}
	}
	componentDidMount() {
		this.setState({ preferences: this.getPrefs() });
		const localNewArticles = getLocalArticles();
		const read = this.state.preferences.read || [];
		const filtered = localNewArticles.filter(art => !read.includes(art.id));
		if (filtered.length > 0) {
			this.setState({ articles: filtered });
		}
		// queue feed update through firebase function
		const updateFeed = window.fetch(NEW_ARTICLES_URL, {
			method: 'GET',
			mode: 'cors',
			headers: new Headers({
				'Content-Type': 'application/json',
				'x-preferences': this.state.preferences
			})
		});
		updateFeed
			.then(data => data.json())
			.then(newArticles => {
				console.log('newArticles:', newArticles);
				// be sure that articles and uniques is never zero
				const unique =
					this.state.articles.length === 0 && newArticles.length > 0
						? newArticles
						: differenceBy(this.state.articles, newArticles, 'id');
				console.log('unique', unique);
				const filteredUniq = unique.filter(art => read.includes(art.id) === false);
				if (filteredUniq.length > 0) {
					this.setState({ newArticles: filteredUniq });
				}
			})
			.catch(err => console.error(err));
	}

	render(props, state) {
		const mergeNewArticles = e => {
			// user asked to see new articles. merge them to top of articles list
			console.log('mergeNewArticles!');
			const merged = state.newArticles.concat(state.articles);
			// state.articles.unshift(...state.newArticles);
			this.setState({ newArticles: [] });
			this.setState({ articles: merged });
			setLocalArticles(merged);
		};
		// const updateButtonClass = state.articles.length > 0 ? {style.show} : {style.hide};
		const updateButton = (
			<Button className="mdc-button mdc-button--raised" onClick={mergeNewArticles}>
				Load {state.newArticles.length} new articles!
			</Button>
		);
		const emptyMessage = (
			<Card>
				<Card.Primary>
					<Card.Subtitle>All caught up!</Card.Subtitle>
				</Card.Primary>
			</Card>
		);
		return (
			<articlelist className={style.articlelist}>
				{state.newArticles.length > 0 ? updateButton : null}
				{state.articles.length === 0 ? emptyMessage : null}
				{map(state.articles, (article, key, markAsRead) => (
					<Article key={key} {...article} markAsRead={this.markAsRead} />
				))}
			</articlelist>
		);
	}
}
