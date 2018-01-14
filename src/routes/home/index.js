import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import ArticleList from '../../components/articleList';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';

export default class Home extends Component {
	render() {
		return (
			<home class={style.home}>
				<ArticleList />
			</home>
		);
	}
}
