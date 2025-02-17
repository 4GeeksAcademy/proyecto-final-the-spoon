export function UserProfile ({name, email, avatar}) {
    return (
        <div>
            <img src={avatar} alt="Avatar del Usuario" />
            <p>{name}</p>
            <p>{email}</p>
        </div>
    );
}
