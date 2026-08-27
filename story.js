const storyBeat = document.querySelector('#story-beat');
const storyTime = document.querySelector('#story-time');
const storyText = document.querySelector('#story-text');
const storyMoments = [
  [0, 'The city lost its signal at 03:17.'],
  [2.8, 'Your ship is the last light still moving.'],
  [5.8, 'The storm is waking. Follow the shards.'],
  [8.4, 'Keep drifting. Every second buys the city another breath.']
];
let shownMoment = -1;

function updateStory() {
  if (state.active && state.elapsed < 10) {
    const moment = storyMoments.reduce((current, candidate, index) => (candidate[0] <= state.elapsed ? { data: candidate, index } : current), { data: null, index: -1 });
    if (moment.index !== shownMoment) {
      shownMoment = moment.index;
      storyTime.textContent = `00:0${Math.floor(moment.data[0])}`;
      storyText.textContent = moment.data[1];
      storyBeat.classList.remove('is-hidden');
    }
  } else if (!state.active || state.elapsed >= 10) {
    storyBeat.classList.add('is-hidden');
    if (!state.active) shownMoment = -1;
  }
  requestAnimationFrame(updateStory);
}

updateStory();
