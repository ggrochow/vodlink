import  { lolRoleImageUrl } from '../../utils';

const roles = [
    'Top',
    'Mid',
    'Bot',
    'Jungle',
    'Support'
];

const RoleSelect = (props) => (
    <div>
        { roles.map( role => (
            <img
                key={role}
                src={lolRoleImageUrl(role)}
                alt={role}
                onClick={props.onRoleClick(role.toLowerCase())}
            />
        ))}

        { /*language=SCSS*/ }
        <style jsx>{`            
            div {
                display: flex;
                flex-wrap: wrap;
                
                justify-content: space-around;
                align-content: center;
            }
            img { 
              cursor: pointer;
            }
        `}</style>
    </div>
);

export default RoleSelect;
