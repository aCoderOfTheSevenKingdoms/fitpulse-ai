import {GoalCard} from './GoalCard';

export const GoalsList = ({ goals = [], handleAction }) => {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide flex flex-col gap-3 pr-1">
      {goals.map((goal) => (
        <GoalCard key={goal.day} goal={goal} handleAction={handleAction} />
      ))}
    </div>
  );
};