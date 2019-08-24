const ErrorText = (props) => (
    <p>
        {props.children}
        {/*language=SCSS*/}
        <style jsx>{`
            p {
              text-align: center;
              color: indianred;
            }
        `}</style>
    </p>
);

export default ErrorText;
